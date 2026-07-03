async function testApi(name, url, method = 'GET') {
  const start = Date.now();
  console.log(`\n========================================`);
  console.log(`[TESTING] ${name}`);
  console.log(`URL: ${url}`);
  try {
    const res = await fetch(url, { method });
    const elapsed = Date.now() - start;
    console.log(`STATUS: ${res.status} ${res.statusText}`);
    console.log(`LATENCY: ${elapsed}ms`);
    
    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      json = text.slice(0, 500) + '... (truncated non-JSON)';
    }

    console.log(`PAYLOAD (preview):`);
    if (typeof json === 'object') {
      console.log(JSON.stringify(json, null, 2).slice(0, 1000) + '\n... (truncated for display)');
    } else {
      console.log(json);
    }
  } catch (err) {
    console.log(`ERROR: ${err.message}`);
  }
}

async function run() {
  // 1. PNCP - Consultar Contratações Recentes (tamanho da página = 2)
  await testApi(
    'PNCP - Contratações Recentes',
    'https://pncp.gov.br/api/consulta/v1/contratacoes/publicas?pagina=1&tamanhoPagina=2'
  );

  // 2. Compras.gov.br - Módulo Legado Licitação (tamanho da página = 1)
  await testApi(
    'Compras.gov.br - Consulta de Licitações (Legado)',
    'https://dadosabertos.compras.gov.br/modulo-legado/1_consultarLicitacao?pagina=1'
  );

  // 3. BrasilAPI - Consulta CNPJ da Petrobras
  await testApi(
    'BrasilAPI - Consulta CNPJ (Petrobras)',
    'https://brasilapi.com.br/api/cnpj/v1/33000167000101'
  );

  // 4. SICONFI - Listar Entes Federativos
  await testApi(
    'SICONFI - Cadastro de Entes',
    'http://apidatalake.tesouro.gov.br/ords/siconfi/tt/entes'
  );
}

run();
