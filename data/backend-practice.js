const xhr=new XMLHttpRequest(); // creates a new http message to send the vbackend

 
xhr.addEventListener('load',()=>{
 console.log( xhr.response);         // default response type is string
});
xhr.open('GET','https://supersimplebackend.dev');
xhr.send();
 

