// JavaScript Document
function clicked()
{
	document.getElementById('date').innerHTML=Date();
}
var y =["Bibek Mallik "];
function changeName()
{
	//var y =["Bibek Mallik "];
	var x=document.getElementById('name');
	var name = prompt("Please enter your name").toLowerCase();
	if (name!="null"&&name!="")
	{
		y[y.length]=name;
		x.innerHTML=y;
	}
	
}