const express = require('express')
require('dotenv').config()
const app = express()



const githubData = {
    "login": "khushramnani",
    "id": 123285904,
    "node_id": "U_kgDOB1kxkA",
    "avatar_url": "https://avatars.githubusercontent.com/u/123285904?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/khushramnani",
    "html_url": "https://github.com/khushramnani",
    "followers_url": "https://api.github.com/users/khushramnani/followers",
    "following_url": "https://api.github.com/users/khushramnani/following{/other_user}",
    "gists_url": "https://api.github.com/users/khushramnani/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/khushramnani/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/khushramnani/subscriptions",
    "organizations_url": "https://api.github.com/users/khushramnani/orgs",
    "repos_url": "https://api.github.com/users/khushramnani/repos",
    "events_url": "https://api.github.com/users/khushramnani/events{/privacy}",
    "received_events_url": "https://api.github.com/users/khushramnani/received_events",
    "type": "User",
    "user_view_type": "public",
    "site_admin": false,
    "name": "⚡ KHUSH ⚡",
    "company": null,
    "blog": "",
    "location": "INDIA",
    "email": null,
    "hireable": null,
    "bio": "Web developer | HTML, CSS, JavaScript, Java | Passionate about creating seamless and engaging web experiences. 🚀💻",
    "twitter_username": "KhushRamnani",
    "public_repos": 17,
    "public_gists": 0,
    "followers": 12,
    "following": 25,
    "created_at": "2023-01-22T04:56:05Z",
    "updated_at": "2025-04-24T01:37:44Z"
  }
  

app.get('/hello' , (req , res)=>{
    res.send('Hello World')
})

app.get('/' , (req , res)=>{
    res.send('Hellooooo!')
})

app.get('/githubData' , (req , res)=>{
    res.json(githubData)
})

app.get('/getname' , (req , res)=>{
    res.send(`<h1>${githubData.name}</h1>`)
})


app.listen(process.env.PORT , (req , res)=>{
    console.log(`App running on port ${process.env.PORT}`);
    
})