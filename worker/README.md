# Nex ara sunucusu kurulumu (Cloudflare Worker)

1. https://dash.cloudflare.com adresinde ücretsiz hesap açın.
2. Workers & Pages > Create > Worker > "Hello World" ile yeni bir Worker oluşturun ve
   `nex-worker.js` içeriğini yapıştırıp Deploy edin.
3. Worker'ın Settings > Variables bölümünde şunları ekleyin:
   - **Secret** `XAI_API_KEY`: xAI'den aldığınız anahtar (Encrypt olarak kaydedin, bu dosyaya ya da sohbete yazmayın).
   - **Variable** `XAI_MODEL`: xAI dokümanındaki güncel model adı (https://docs.x.ai).
   - **Variable** `ALLOWED_ORIGIN`: `https://esderiehub.github.io`
4. Worker adresinizi (ör. `https://nex.<hesabınız>.workers.dev`) bana iletin; siteye bağlarım.
