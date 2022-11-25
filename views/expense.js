let c = 0;
let cc = 1;
let pag = document.getElementById('expense');
var logout=document.getElementById('logout');
logout.addEventListener('click',()=>{
  localStorage.removeItem('token')
})

window.addEventListener('DOMContentLoaded', ()=> {
    const token = localStorage.getItem('token');
    console.log("inside expense.js get")
    axios.get(`http://localhost:3000/pagination?page=0`, { headers: {Authorization: token} })
    .then(response => {
        console.log(response.data.Expenses.length,"Length is")
        if(response.data.user.ispremiumuser==true){
          console.log(response.data.user)
          console.log("User is premium")
          let div=document.getElementById('premiumdiv')
          let a=document.createElement('a');
          a.setAttribute('href','http://127.0.0.1:5500/views/premiumuser.html')
          a.innerHTML="Premium"
          
          document.querySelector(".nav").classList.add("premium");
          document.querySelector(".wrapper").classList.add("premium");
          document.querySelector(".footer").classList.add("premium");
          div.appendChild(a);

        }
        if(response.status === 200){
            response.data.Expenses.forEach(expense => {
            console.log(expense)
            showexpense(expense);
        })
        }
    })
    .catch(err=>console.log(err))
    pagination()
});


function pagination(){
  const token =localStorage.getItem('token');
    
  axios.get("http://localhost:3000/getexpense" , { headers: {Authorization: token} })
    .then((expense)=>{
      console.log(expense.data,"expense in pagination function---")
      let number_of_pages;
      if(expense.data.Expenses.length % 10 == 0) {
         number_of_pages = Math.trunc(((expense.data.Expenses.length))/10)
      } else {
         number_of_pages = Math.trunc(((expense.data.Expenses.length))/10)+1
      }
     
      for (let i = 0; i < number_of_pages; i++) {
        pag.innerHTML += `<button class="pagebtn" id="?page=${c++}">${cc++}</button> `;
      }
    })
    .catch(err=> console.log(err))

}



pag.addEventListener('click', (e)=>{
  let id = e.target.id;
  console.log(id,"--this is id")
  const token=localStorage.getItem('token')
  axios.get(`http://localhost:3000/pagination${id}`, { headers: {Authorization: token} })
  .then(expense=>{
    console.log("Add even listener",expense)
    let pagedata =expense.data.Expenses;
    const parentElement = document.getElementById('pop');
    parentElement.innerHTML=''
    // const parentElement = document.getElementById('pop');
    // const expenseElemId = `expense-${expense.id}`;
    // console.log("inside show expense")
    pagedata.forEach(expense => {
      console.log("Page data",expense)
      showexpense(expense);
  })
  .catch(err=> console.log(err))
})
})

function showexpense(expense){
  const parentElement = document.getElementById('pop');
  const expenseElemId = `expense-${expense._id}`;
  console.log("Hello everyone inside show expense",expense._id)
  parentElement.innerHTML += `
      <li id=${expenseElemId}>
          ${expense.amount} - ${expense.category} - ${expense.description}
          <button onclick="deleteExpense('${expense._id}')">Delete</button>`
    console.log("Trying to delete expense")
  // let deletefunc=document.getElementById(expense._id)
  // console.log(deletefunc)
//  deletefunc.addEventListener('click',deleteExpense(expense._id))

}

function addExpense(e){
    e.preventDefault();
    console.log("inside add expense function in script")
    let expenseDetails = {
        amount: document.getElementById("amount").value,
        description: document.getElementById("desc").value,
        category: document.getElementById("cat").value,
    };
    console.log(expenseDetails.amount,expenseDetails.description,expenseDetails.category,"expense object in frotend")
    const token = localStorage.getItem('token');
    console.log(expenseDetails)
    axios.post('http://localhost:3000/addexpense',expenseDetails, { headers: {Authorization: token} })
    .then((response) => {

    if(response.status === 201){
        showexpense(response.data.expense);
    } else {
        throw new Error('Failed To create new expense');
    }
    })
    .catch(err => console.log(err))
}


function deleteExpense(expenseid) {
  console.log(expenseid,"this is delete expense")
    const token =localStorage.getItem('token');
    console.log(token)
    let url=`http://localhost:3000/deleteexpense/${expenseid}`
    let config={
      headers: {Authorization: token}
    }
    console.log(config,"this is config")
    axios.post(url,{},config)
    .then((response) => {
    if(response.status === 204){
            const expenseElemId = `expense-${expenseid}`;
            document.getElementById(expenseElemId).remove();
        } else {
            throw new Error('Failed to delete');
        }
    }).catch((err => {
        document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
    }))
}





const URLTOBACKEND = "http://localhost:3000/";
const EMAILID = "suravpanda601@gmail.com";
const PHONENO = 7008527298;
async function gopremium(event) {
  const token = localStorage.getItem("token");
  event.preventDefault();
  const response = await axios.get("http://localhost:3000/premium", {
    headers: { Authorization: token },
  });
  //console.log(response)
  var options = {
    key: response.data.key_id,
    name: "Sourav Kumar Panda",
    amount: "3500",
    currency: "INR",
    order_id: response.data.purchase.id,
    prefill: {
      name: "Sourav Kumar Panda",
      email: `${EMAILID}`,
      contact: `${PHONENO}`,
    },
    theme: {
      color: "#3399cc",
    },

    handler: function (response) {
      console.log(response,"sadsadasd");
      axios
        .post(
          'http://localhost:3000/updatestatus',
          {
            purchaseId: options.order_id,
            paymentId: response.razorpay_payment_id,
          },
          { headers: { Authorization: token } }
        )
        .then(() => {
          alert("You are a Premium User Now");
          document.querySelector(".nav").classList.add("premium");
          document.querySelector(".wrapper").classList.add("premium");
          document.querySelector(".footer").classList.add("premium");
          let btn = document.createElement("button");
          btn.setAttribute("value","Delete")
          deletebtn.setAttribute("type","button")
            
          //document.querySelector("#premiumbtn").remove();
          //document.querySelector("#premiumbtn").remove();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  };

const rzp1 = new Razorpay(options);
rzp1.open();
rzp1.on("payment.failed", function (response) {
  // alert(response.error.code);
  // alert(response.error.description);

  console.log(response);
});

}
