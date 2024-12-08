const api = "http://localhost:8080/posts/1";

// fetch(api)
//     .then(res => res.json())
//     .then(post => console.log(post))
//     .catch(err => console.log(err));

fetch(api)
    .then(async res => {
        const post = await res.json();
        console.log(post);
    });

// async function fetchPost() {
//     const res = await fetch(api);
//     const post = await res.json();

//     console.log(post);
// }

// fetchPost();
