/* ---------- UTILIDADES ---------- */
// remove acentos e deixa minúsculo para comparar bairros
function normalizeText(t){
  // Função robusta para limpar o texto antes de comparar
  return t.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

/* ---------- TAXAS (Itabuna, BA - Tabela de Entrega Consolidada) ---------- */

const taxas = {
  // Taxas Baixas (R$7 - R$8) - Bairros centrais e vizinhos
  "centro": 7,
  "goes calmon": 8,
  "pontalzinho": 8,
  "mangabinha": 8,
  "conceicao": 8,
  "castalia": 8,
  "sao lourenco": 8,
  
  // Taxas Médias (R$9 - R$10) - Distância moderada
  "banco raso": 9,
  "sao jose": 9,
  "sarinha alcantara": 12,
  "fatima": 10,
  "santo antonio": 10,
  "sao pedro": 10,
  "gloria": 10,
  "jardim primavera": 10,
  "santa ines": 12,
  "sao judas": 10,

  // Taxas Altas (R$12 - R$13) - Distância maior ou áreas mais periféricas
  "california": 12,
  "joao soares": 12,
  "sao roque": 12,
  "sao caetano": 12,
  "novo sao caetano": 12,
  "monte libano": 12,
  "lomanto": 12,
  "monte cristo": 12,
  "jardim vitoria": 12,
  "santana": 12, 
  "odilon": 12,
  "parque boa vista": 12,
  "jacana": 13,
  "jaçana": 13,
  "pedro geronimo": 13,
  "fonseca": 13,
  "vila zanor": 13,

  // Taxas Distantes/Periféricas (R$15) - Distância considerável, risco noturno
  "ferradas": 15,
  "salobrinho": 15,
  "vila esperanca": 15,
  "nova itabuna": 15,
  "maria pinheiro": 15,
  "mutira": 15,
  "vale do sol": 15,
  "novo horizonte": 15,
  "santa clara": 15
};

/* ---------- ELEMENTOS ---------- */
const continuarBtn = document.getElementById('continuarBtn');
const etapaDados = document.getElementById('etapa-dados');
const etapaCardapio = document.getElementById('etapa-cardapio');
const voltarBtn = document.getElementById('voltarBtn'); 
const clienteResumo = document.getElementById('clienteResumo');

// Elementos da etapa de dados
const bairroInput = document.getElementById('bairroCliente');
const bairroInfoBox = document.getElementById('bairroInfoBox');
const bairroInfoText = document.getElementById('bairroInfoText');
const bairrosDatalist = document.getElementById('bairros-sugeridos'); 
const entregaRadio = document.querySelectorAll('input[name="entrega"]');
const enderecoFields = document.getElementById('endereco-fields');
const nomeInput = document.getElementById('nome');
const ruaInput = document.getElementById('rua');
const numeroInput = document.getElementById('numero');
const complementoInput = document.getElementById('complemento'); 
const referenciaInput = document.getElementById('referencia');
const observacaoInput = document.getElementById('observacao');
const pagamentoSelect = document.getElementById('pagamento');
const trocoInput = document.getElementById('troco');

// Elementos do cardápio e finalização
const quantidadeInputs = () => Array.from(document.querySelectorAll('.quantidade'));
const valorTotalEl = () => document.getElementById('valorTotal');
const valorTotalCardapioEl = () => document.getElementById('valorTotalCardapio');
const fazerPedidoBtn = document.getElementById('fazerPedido');
const statusLojaEl = document.getElementById('statusLoja'); 


/* ---------- INICIALIZAÇÃO DATALIST ---------- */

if (bairrosDatalist) {
  Object.keys(taxas).forEach(normalizedBairro => {
      // Reverte a normalização para um formato legível para exibição nas sugestões (Datalist)
      const displayBairro = normalizedBairro.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
      
      const option = document.createElement('option');
      option.value = displayBairro;
      bairrosDatalist.appendChild(option);
  });
}

// === LÓGICA DE DELIVERY vs. BALCÃO 
entregaRadio.forEach(radio => {
    radio.addEventListener('change', () => {
        const isDelivery = document.querySelector('input[name="entrega"]:checked').value === 'delivery';
        
        enderecoFields.style.display = isDelivery ? 'block' : 'none';
        
        // Define se os campos de endereço são obrigatórios ou não
        bairroInput.required = isDelivery;
        ruaInput.required = isDelivery;
        numeroInput.required = isDelivery;
        
        // Limpa o feedback de taxa se for retirada
        if (!isDelivery) {
            bairroInfoBox.style.display = 'none';
        } else {
            // Força a atualização do feedback de taxa para o bairro digitado
            bairroInput.dispatchEvent(new Event('input'));
        }
        
        // Força a atualização do total ao mudar o tipo de entrega
        atualizarTotal();
    });
});
// Ativa o evento na inicialização para definir o estado inicial (Delivery por padrão)
document.getElementById('entrega-delivery').dispatchEvent(new Event('change'));


// === LÓGICA DE PAGAMENTO (Troco) ===
if (pagamentoSelect) {
    pagamentoSelect.addEventListener('change', (e) => {
        const trocoFields = document.getElementById('troco-fields');
        if (e.target.value === 'Dinheiro') {
            trocoFields.style.display = 'block';
            trocoInput.required = true; // Torna o campo de troco obrigatório
        } else {
            trocoFields.style.display = 'none';
            trocoInput.required = false;
            trocoInput.value = ''; // Limpa o campo se não for dinheiro
        }
    });
}

// Ativa o evento na inicialização para definir o estado inicial
if (pagamentoSelect) pagamentoSelect.dispatchEvent(new Event('change'));


/* ---------- FUNÇÕES DE TAXA E TOTAL ---------- */

function getTaxaByBairro(bairroTexto){
  if (!bairroTexto) return 0;
  const n = normalizeText(bairroTexto);
  
  // Tenta match exato no dicionário de taxas
  return taxas[n] !== undefined ? taxas[n] : 0;
}

// Monitora a digitação no campo bairro para atualizar a taxa em tempo real na tela de dados
if (bairroInput) {
  bairroInput.addEventListener('input', () => {
    const entrega = document.querySelector('input[name="entrega"]:checked').value;
    if (entrega !== 'delivery') return; // Só mostra feedback se for delivery

    const taxa = getTaxaByBairro(bairroInput.value);
    
    if (taxa > 0) {
      bairroInfoText.textContent = `🚗 Taxa de entrega estimada: R$${taxa.toFixed(2).replace('.', ',')}`;
      bairroInfoBox.style.display = 'block';
      bairroInfoBox.style.backgroundColor = '#d4edda'; // Cor de sucesso
      bairroInfoBox.style.borderColor = '#c3e6cb';
      bairroInfoText.style.color = '#155724';
    } else if (bairroInput.value.trim().length > 3) {
      bairroInfoText.textContent = '⚠️ Bairro fora da área de entrega ou nome incorreto. Verifique.';
      bairroInfoBox.style.display = 'block';
      bairroInfoBox.style.backgroundColor = '#fff3e0'; // Cor de aviso
      bairroInfoBox.style.borderColor = '#ff9800';
      bairroInfoText.style.color = '#e65100';
    } else {
      bairroInfoBox.style.display = 'none';
    }
  });
}

function atualizarTotal(){
  const inputs = quantidadeInputs();
  let subtotal = 0;
  inputs.forEach(inp => {
    const preco = parseFloat(inp.dataset.preco) || 0;
    const qtd = parseInt(inp.value) || 0;
    subtotal += preco * qtd;
  });
  
  // 1. Obtém dados do formulário na tela de dados para calcular a taxa
  const entregaSelecionada = document.querySelector('input[name="entrega"]:checked') ? 
                             document.querySelector('input[name="entrega"]:checked').value : 'delivery';
  const bairroAtual = bairroInput ? bairroInput.value.trim() : '';

  // 2. Calcula a taxa
  let taxa = 0;
  let bairroDisplay = 'Aguardando dados...';

  if (entregaSelecionada === 'delivery') {
    taxa = getTaxaByBairro(bairroAtual);
    bairroDisplay = bairroAtual || 'Bairro pendente';
  } else if (entregaSelecionada === 'balcao') {
    taxa = 0;
    bairroDisplay = 'Retirada no Balcão';
  }

  const total = subtotal + taxa;
  
  // Atualiza o total se o elemento existir (ele está na etapa-dados)
  if(valorTotalEl()){
    valorTotalEl().textContent = `R$${total.toFixed(2).replace('.', ',')}`;
  }

  if (valorTotalCardapioEl()) {
  valorTotalCardapioEl().textContent = `R$${subtotal.toFixed(2).replace('.', ',')}`;
}

  
  // 3. Atualiza o box de resumo (só se etapa-dados estiver visível)
  const dados = JSON.parse(localStorage.getItem('dadosCliente') || '{}');
  const nomeCliente = dados.nome || 'Cliente';
  const pagamentoTexto = dados.pagamentoDisplay || 'Pagamento pendente';

  // O resumo agora aparece na ETAPA-DADOS
  if (etapaDados.style.display !== 'none' && clienteResumo) { 
    clienteResumo.textContent = `${nomeCliente} — ${bairroDisplay} — Pagamento: ${pagamentoTexto}`; 
    
    // Atualiza o texto da taxa
    const bairroInfoTextCardapio = document.getElementById('bairroInfoTextCardapio');
    if (entregaSelecionada === 'balcao') {
      bairroInfoTextCardapio.textContent = '🛵 Retirada no Balcão: Sem taxa de entrega.';
      bairroInfoTextCardapio.style.color = '#155724'; 
    } else if (taxa > 0) {
      bairroInfoTextCardapio.textContent = `🛵 Taxa de Entrega: R$${taxa.toFixed(2).replace('.', ',')}`;
      bairroInfoTextCardapio.style.color = '#d32f2f'; 
    } else {
      bairroInfoTextCardapio.textContent = '⚠️ Taxa de Entrega: Bairro não encontrado ou a ser confirmada!';
      bairroInfoTextCardapio.style.color = '#e65100';
    }
  }

  return { subtotal, total: total, taxa: taxa }; 
}


/* ---------- LISTENERS DE AÇÕES DE QUANTIDADE E INPUTS ---------- */

// === BOTÕES DE QUANTIDADE ===
document.addEventListener('click', (e) => {
    if (e.target.matches('.mais')) {
        const input = e.target.parentElement.querySelector('.quantidade');
        input.value = parseInt(input.value || 0) + 1;
        atualizarTotal();
    }
    if (e.target.matches('.menos')) {
        const input = e.target.parentElement.querySelector('.quantidade');
        if (parseInt(input.value) > 0) input.value = parseInt(input.value) - 1;
        atualizarTotal();
    }
});

// Atualiza o total se o usuário digitar a quantidade
document.addEventListener('input', (e) => {
    if (e.target.matches('.quantidade')) atualizarTotal();
});

// === LÓGICA DE CONTINUAR (CARDÁPIO -> DADOS) ===
if (continuarBtn) {
    continuarBtn.addEventListener('click', (e) => { // Adicione o 'e' (evento)
        e.preventDefault(); // Impedir qualquer envio de formulário padrão

        // 1. Validação: Checa se algum item foi selecionado no menu.
        const itensSelecionados = quantidadeInputs().filter(inp => parseInt(inp.value) > 0);
        if (itensSelecionados.length === 0) {
            alert('Por favor, selecione pelo menos um item para continuar!');
            return; // Impede a continuação
        }

        // Se houver itens, executa a transição.
        
        // 2. Transição de tela
        etapaCardapio.style.display = 'none'; // Esconde Cardápio
        etapaDados.style.display = 'block'; // Mostra Dados (Checkout)
        window.scrollTo(0, 0); // Volta para o topo

        // 3. Atualiza o total e resumo na tela de dados
        atualizarTotal();
    });
}
// === LÓGICA DE VOLTAR (DADOS -> CARDÁPIO) ===
if (voltarBtn) {
    voltarBtn.addEventListener('click', () => {
        etapaDados.style.display = 'none'; // Esconde Dados (Checkout)
        etapaCardapio.style.display = 'block'; // Mostra Cardápio
        window.scrollTo(0, 0); // Volta para o topo
    });
}

/* ---------- LÓGICA DE HORÁRIO DE FUNCIONAMENTO ---------- */

// A loja abre às 17:30 (17:30h da tarde) e fecha às 22:30 (10:30h da noite)
const HORA_ABERTURA = 17; 
const MINUTO_ABERTURA = 30; 
const HORA_FECHAMENTO = 22; 
const MINUTO_FECHAMENTO = 30; 

function checkStatusLoja() {
    if (!statusLojaEl) return;
    
    const dataAtual = new Date();
    const horaAtual = dataAtual.getHours();
    const minutoAtual = dataAtual.getMinutes();

    const comecouAberto = horaAtual >= HORA_ABERTURA;
    const jaFechou = horaAtual > HORA_FECHAMENTO || 
                     (horaAtual === HORA_FECHAMENTO && minutoAtual >= MINUTO_FECHAMENTO);

    const isAberto = comecouAberto && !jaFechou;

    if (isAberto) {
        statusLojaEl.textContent = '✅ Estamos Abertos! Faça seu pedido até 22:30h.';
        statusLojaEl.classList.add('status-aberto');
        statusLojaEl.classList.remove('status-fechado');
        
    } else {
        statusLojaEl.textContent = '⛔ Fechado. Pedidos podem ser feitos, mas só serão processados após 17:30h.';
        statusLojaEl.classList.add('status-fechado');
        statusLojaEl.classList.remove('status-aberto');
    }
    
    // Mantém os botões habilitados para permitir pedidos fora do horário
    if (continuarBtn) continuarBtn.disabled = false;
    if (fazerPedidoBtn) fazerPedidoBtn.disabled = false;
}

// Inicia a checagem e verifica a cada minuto
setInterval(checkStatusLoja, 60000); 
checkStatusLoja();


// === LÓGICA FINALIZAR PEDIDO  ===
if (fazerPedidoBtn) {
    fazerPedidoBtn.addEventListener('click', (event) => {
        event.preventDefault(); 

        // 1. Obtenção e Validação dos dados do formulário
        const selectPagamento = document.getElementById('pagamento');
        const trocoFields = document.getElementById('troco-fields');
        const entregaSelecionada = document.querySelector('input[name="entrega"]:checked').value;
        const isDelivery = entregaSelecionada === 'delivery';

        let isValid = nomeInput.checkValidity();
        
        if (isDelivery) {
            // Garante que os campos de endereço sejam validados
            const requiredFields = [bairroInput, ruaInput, numeroInput];
            for (const field of requiredFields) {
                if (!field.checkValidity()) {
                    isValid = false;
                    break; 
                }
            }
        }
        isValid = isValid && selectPagamento.checkValidity();

        // Validação do troco
        if (selectPagamento.value === 'Dinheiro' && trocoFields.style.display !== 'none') {
            const trocoValue = trocoInput.value.trim();
            const valorNumericoTroco = parseFloat(trocoValue.replace(',', '.'));
            
            if (!trocoValue) {
                alert('Por favor, informe o valor do troco para a opção "Dinheiro".');
                trocoInput.focus();
                return;
            }
            if (isNaN(valorNumericoTroco) || valorNumericoTroco < 0) {
                alert('O valor do troco é inválido. Utilize o formato 50,00.');
                trocoInput.focus();
                return;
            }
        }
        
        // 2. Validação dos itens (Confirma que há algo no pedido)
        const itensSelecionados = quantidadeInputs().filter(inp => parseInt(inp.value) > 0);
        if (itensSelecionados.length === 0) {
            alert('Você precisa selecionar pelo menos um item no cardápio antes de finalizar!');
            etapaDados.style.display = 'none';
            etapaCardapio.style.display = 'block';
            window.scrollTo(0, 0);
            return;
        }

        // 3. Se a validação for aprovada: Salvar Dados + Gerar Mensagem
        if (isValid) {
            // Salva os dados do cliente (para usar no resumo/WhatsApp)
            const pagamentoTexto = selectPagamento.options[selectPagamento.selectedIndex].textContent.trim();
            const dados = {
                nome: nomeInput.value.trim(),
                entrega: entregaSelecionada,
                bairro: isDelivery ? bairroInput.value.trim() : 'N/A',
                rua: isDelivery ? ruaInput.value.trim() : 'N/A',
                numero: isDelivery ? numeroInput.value.trim() : 'N/A',
                complemento: complementoInput.value.trim(),
                referencia: referenciaInput.value.trim(),
                observacao: observacaoInput.value.trim(),
                pagamento: selectPagamento.value,
                pagamentoDisplay: pagamentoTexto,
                troco: trocoInput.value.trim()
            };
            localStorage.setItem('dadosCliente', JSON.stringify(dados));
            
            // Gerar e enviar mensagem 
            
            // a. Recalcula o total 
            const { subtotal, total: totalFinal, taxa } = atualizarTotal(); 

            // b. Monta a lista de itens
            const itens = itensSelecionados.map(input => {
                const nome = input.dataset.nome;
                const preco = parseFloat(input.dataset.preco);
                const qtd = parseInt(input.value);
                const subtotalItem = preco * qtd;
                return `• ${nome} x${qtd} — R$${subtotalItem.toFixed(2).replace('.', ',')}`;
            });

            // c. Monta o endereço
            let tipoEntrega = dados.entrega === 'delivery' ? 'Entrega (Delivery)' : 'Retirada no Balcão';
            let enderecoCompleto = '';
            if (dados.entrega === 'delivery') {
                enderecoCompleto = 
                    `Bairro: ${dados.bairro}
Rua: ${dados.rua}, Nº ${dados.numero}
Complemento: ${dados.complemento || 'Nenhum'}
Referência: ${dados.referencia || 'Nenhuma'}`;
            } else {
                enderecoCompleto = 'O cliente irá retirar no balcão.';
            }

            // d. Taxa e aviso
            const taxaTxt = taxa > 0 ? `R$${taxa.toFixed(2).replace('.', ',')}` : 'R$0,00 (A CONFIRMAR)';
            if (dados.entrega === 'delivery' && taxa === 0) {
                tipoEntrega += ' ⚠️ TAXA A CONFIRMAR';
            }

            // e. Troco
            let trocoTxt = '';
            if (dados.pagamento === 'Dinheiro' && dados.troco) {
                if (parseFloat(dados.troco.replace(',', '.')) > totalFinal) {
                    trocoTxt = `\nTroco para: R$${dados.troco.replace('.', ',')}`;
                } else {
                    trocoTxt = `\nNão precisa de troco.`;
                }
            }
            
            // f. Observação
            const observacaoTxt = dados.observacao || 'Nenhuma';
            
            // g. Aviso de loja
            const dataAtual = new Date();
            const horaAtual = dataAtual.getHours();
            const minutoAtual = dataAtual.getMinutes();

            const comecouAberto = horaAtual >= HORA_ABERTURA;
            const jaFechou = horaAtual > HORA_FECHAMENTO || (horaAtual === HORA_FECHAMENTO && minutoAtual >= MINUTO_FECHAMENTO);
            const isAbertoAtual = comecouAberto && !jaFechou;

            let avisoFechado = '';
            if (!isAbertoAtual) {
                avisoFechado = `\n\n⚠️ *ATENÇÃO: PEDIDO FORA DO HORÁRIO*\nEste pedido foi feito com a loja *FECHADA* (Abrimos às ${HORA_ABERTURA}:00h).\nEle será processado assim que a loja reabrir.`;
            }

            // h. Monta a mensagem final
            const mensagem = encodeURIComponent(
`📦 *Novo Pedido - Casa da Esfirra* 🍕${avisoFechado}
----------------------------------------
🍽️ *Itens selecionados:*
${itens.join('\n')}
----------------------------------------
👤 *Cliente:* ${dados.nome}
🚚 *Forma de entrega:* ${tipoEntrega}

🏡 *DETALHES DA ENTREGA:*
${enderecoCompleto}

💰 *DETALHES DO PAGAMENTO:*
Forma de Pagamento: ${dados.pagamentoDisplay}${trocoTxt}

💸 *VALORES:*
Subtotal: R$${subtotal.toFixed(2).replace('.', ',')}
Taxa de Entrega: ${taxaTxt}
*Total Final:* R$${totalFinal.toFixed(2).replace('.', ',')}

📝 *Observações:* ${observacaoTxt}
----------------------------------------
*Obrigado pela preferência!*`);
            
            // Enviar para o WhatsApp 
            const whatsappLink = `https://api.whatsapp.com/send?phone=5507398206-7758&text=${mensagem}`;
            window.open(whatsappLink, '_blank');
        } else {
            alert('Por favor, preencha todos os campos obrigatórios e corrija os erros nos dados do cliente.');
        }
    });
}

