var size=0;
var data 
var is_logged_in=false;

window.onload=async function()
{
    var userManagement= catalyst.auth;
    var current_user= userManagement.isUserAuthenticated()
    await current_user.then(msg=>
    {
        is_logged_in =true
    })
    .catch(err=>
    {
        is_logged_in=false
    })  
    if(is_logged_in)
    {
        document.getElementById("inner_page").style.display="flex";
        print_todo_func()
    }
    if(!is_logged_in)
    {
        document.getElementById("temp").style.display="flex";
        // document.getElementById("pro_image").style.display="none";
        // document.getElementById("signin").style.display="block";
        // document.getElementById("header_box").style.display="none";
        // document.getElementById("all_todo").style.display="none";
    }
}

async function fetch_insert_url()
{
    data=await fetch(window.location.origin+"/server/todoservices/getdata")
    .then(res=>res.json())
    .catch(err=>err)
    size=data.length
}
// document.addEventListener("DOMContentLoaded", function() {
//      document.getElementById("add_todo").addEventListener("click",add_todo_func);
// });

function add_todo_func()
{
    var form_bg=document.getElementById("form_bg");
    form_bg.style.display="flex"
}
function close_form()
{
    document.getElementById("todo_name_form").value="";
    document.getElementById("COMPLETED").checked=false;
    document.getElementById("NCOMPLETED").checked=false;
    document.getElementById("todo_id_form").value="";
    var form_bg=document.getElementById("form_bg")
    form_bg.style.display="none";
}
function close_edit()
{
    document.getElementById("todo_name_edit").value="";
    document.getElementById("ECOMPLETED").checked=false;
    document.getElementById("ENCOMPLETED").checked=false;
    var form_bg=document.getElementById("edit_bg")
    form_bg.style.display="none";
}
function submit_form()
{
    var temp_id=document.getElementById("todo_id_form").value
    var temp_name=document.getElementById("todo_name_form").value
    var temp_completed=document.querySelector('input[name="COMPLETED"]:checked').value

    async function insert_todo()
    {
        await fetch("/server/todoservices/insert",{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            ID:temp_id,
            TODO:temp_name,
            COMPLETED:temp_completed
        })
    })
    }
    insert_todo();
    close_form();
    const todoItems = all_todo.querySelectorAll("#one_todo");
    todoItems.forEach(item => item.remove()); 
    print_todo_func();
}
async function print_todo_func()
{
    await fetch_insert_url();
    for(let j=size-1;j>=0;j--)
    {
        var nid="ID : "+data[j].ID
        var ntodo= "TODO : "+data[j].TODO
        var ncompleted=data[j].COMPLETED

        if(ncompleted==false)
        {
            ncompleted="NOT COMPLETED"
        }
        else{
            ncompleted="COMPLETED"
        }
        
        var all=document.getElementById("all_todo")
        
        var o=document.createElement("div")
        o.id="one_todo"

        var i=document.createElement("div")
        var t=document.createElement("div")
        var c=document.createElement("div")

        i.id="todo_id"
        i.textContent=nid;
        
        t.id="todo_name"
        t.textContent=ntodo;
        
        c.id="todo_completed"
        c.textContent=ncompleted

        var ed=document.createElement("div")
        ed.id="ed_container" 

        var edit_button=document.createElement("button")
        edit_button.id="ID"+data[j].ID
        edit_button.innerHTML="EDIT"
        edit_button.classList.add("edit_button")
        edit_button.addEventListener("click",edit_func)

        var del_button=document.createElement("button")
        del_button.id="ID"+data[j].ID
        del_button.innerHTML="DELETE"
        del_button.classList.add("del_button")
        del_button.addEventListener("click",del_func)

        ed.append(edit_button)
        ed.append(del_button)

        o.append(i)
        o.append(t)
        o.append(c)
        o.append(ed)
        o.style.backgroundColor=getRandomColor();
        all.prepend(o)
        console.log("kadhirvel")
    }
}
function signin_func()
{
    document.getElementById("header_box").style.display="none";
    document.getElementById("login_bg").style.display="flex";
    document.getElementById("temp").style.display="none";
    var auth=catalyst.auth
    catalyst.auth.signIn("login_container");
}
function logout_func()
{
    var redirectURL = "http://localhost:3000/app/index.html";
    var auth = catalyst.auth;
    auth.signOut(redirectURL);
}
var new_id;
var update_row_id;
function edit_func(event)
{
    new_id=event.target.id;
    new_id=new_id.slice(2,)
    document.getElementById("edit_header").textContent="EDIT THE VALUES OF ID "+new_id;
    document.getElementById("edit_bg").style.display="block";
    async function fetch_call_func()
    {
        await fetch_insert_url();
    }
    fetch_call_func();

    var prev_todo,prev_completed;

    for(let z=0;z<=data.length;z++)
    {
        if(new_id==data[z].ID){
            update_row_id=data[z].ROWID;
            prev_todo=data[z].TODO;
            prev_completed=data[z].COMPLETED;
            break;
        }   
    }
    document.getElementById("todo_name_edit").value=prev_todo;
}
function submit_edit(event)
{
    var temp_name=document.getElementById("todo_name_edit").value
    var temp_completed=document.querySelector('input[name="ECOMPLETED"]:checked').value

    async function update_todo()
    {
        await fetch("/server/todoservices/update",{
        method:'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            ROWID:update_row_id,
            TODO:temp_name,
            COMPLETED:temp_completed
        })
    })
    }
    update_todo();
    close_edit();
    const todoItems = all_todo.querySelectorAll("#one_todo");
    todoItems.forEach(item => item.remove()); 
    print_todo_func();
}
var del_id;
function del_func(event)
{
    document.getElementById("del_bg").style.display="flex";
    document.getElementById("del_container").style.display="flex";
    del_id=event.target.id.slice(2)
}
function discard_func()
{
    document.getElementById("del_container").style.display="none";
    document.getElementById("del_bg").style.display="none";
}
function continue_func()
{
    async function fetch_call_func()
    {
        await fetch_insert_url();
    }
    fetch_call_func();
    var del_row_id;
    for(let z=0;z<data.length;z++)
    {
        if(data[z].ID==del_id)
        {
            del_row_id=data[z].ROWID
            break
        }
    }
    async function delete_todo()
    {
        await fetch("/server/todoservices/delete",{
        method:'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            ROWID:del_row_id
        })
    })
    }
    delete_todo()
    document.getElementById("del_bg").style.display="none";
    document.getElementById("del_container").style.display="none";
    const todoItems = all_todo.querySelectorAll("#one_todo");
    todoItems.forEach(item => item.remove()); 
    print_todo_func();
}
function getRandomColor(){
    const r = Math.floor(Math.random() * 256); // Random red (0-255)
    const g = Math.floor(Math.random() * 256); // Random green (0-255)
    const b = Math.floor(Math.random() * 256); // Random blue (0-255)
    const a = Math.random().toFixed(2); // Random alpha (0.00-1.00)
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
    
async function profile()
{
    document.getElementById("profile").style.display="flex";
    document.getElementById("sign_bg").style.display="flex";
    var user=catalyst.userManagement;
    var pro_user=user.getCurrentProjectUser()
    var content;
    await pro_user.then(response => {
        content = response.content;
    }
    )

    var name=document.getElementById("name_details")
    name.textContent=content.first_name+" "+content.last_name;

    var mail=document.getElementById("mail_details")
    mail.textContent=content.email_id;
}
function close_sign()
{
    document.getElementById("profile").style.display="none";
    document.getElementById("sign_bg").style.display="none";
}
function view_profile()
{
    document.getElementById("profile").style.display="none";
    document.getElementById("sign_bg").style.display="none";
}
function signup_func()
{
    document.getElementById("signup_bg").style.display="flex";

}
