let login=document.getElementById('b1')
login.addEventListener('click',()=>{
    let email=document.getElementById('e1').value
    let password=document.getElementById('p1').value
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!(email.match(validRegex))) {
        alert("Invalid email address!");
        return false;
    }
    axios.post("http://localhost:3000/signin",{email:email,password:password})
    .then(response=>{
        localStorage.setItem('token',response.data.token)
        window.location.href="http://127.0.0.1:5500/views/expensetracker.html"
    })
    .catch(err=>{
        alert(err.message)
        console.log(err)
    })
});
