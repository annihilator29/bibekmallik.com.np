// JavaScript Document
function clicked()
{
	document.getElementById('date').innerHTML=Date();
}

function changeName(name)
{
	x=document.getElementById('name');
	if(name=="aacis"||name=="ashish"||name=="aacis mahaseth"||name=="ashish mahaseth")
		{
			x.innerHTML="Re buirwala Randuk";
		}
	else if(name=="susata"||name=="sam"||name=="susata adhikari")
		{
			x.innerHTML="I love you baby";
		}
	else
		{
			x.innerHTML= "Hello "+name;
		}
	
	
	
}