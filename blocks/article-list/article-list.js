const AEM_HOST = 'http://localhost:4502'; // author - flag: swap to publish (4503) once that's running
const QUERY_URL = `${AEM_HOST}/graphql/execute.json/EDS-Project/article-list`;

export default async function decorate(block) {
  const response = await fetch(QUERY_URL, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json',
        'Authorization': 'Basic YWRtaW46YWRtaW4='
     },
  });

  if (!response.ok) return;

  const { data } = await response.json();
  const articles = data?.articleList?.items ?? [];

  block.innerHTML = '';
  articles.forEach(({ title, publishDate, body }) => {
    const card = document.createElement('div');
    card.className = 'article-card';
    card.innerHTML = `
      <h3>${title}</h3>
      <p class="date">${new Date(publishDate).toLocaleDateString()}</p>
      <p>${body?.plaintext ?? ''}</p>
    `;
    block.append(card);
  });
}
