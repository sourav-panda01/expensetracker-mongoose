const signup=document.getElementById('b2')
console.log(signup.value)
signup.addEventListener('click',()=>{
    let name=document.getElementById('n1').value;
    let email=document.getElementById('e2').value;
    let password=document.getElementById('p2').value
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!(email.match(validRegex))) {
        alert("Invalid email address!");
        return false;
    }
    console.log(name,email)
    axios.post('http://localhost:3000/signup',{name:name,email:email,password:password})
    .then(response=>alert("Sign Up done" ))
    .catch(err=>console.log(err))
})