export default function getLoggedInUser() {

  return fetch(`${FETCH_BASE_URL}/current-user`, {
    credentials: 'include',
  })
    .then((res) => {
      if (res.status === 404) {
        throw new Error('Session Expired');
      } else if (res.status === 200) {
        return res.json();
      }
    });
}