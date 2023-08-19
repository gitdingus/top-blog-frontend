export default function getLoggedInUser() {

  return fetch('http://localhost:3000/api/current-user', {
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