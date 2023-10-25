const hint_text = document.getElementById("hint-text");

function edit(hint){
    hint_text.innerHTML = hint;
}

function show(){
    hint_text.style.display = 'block';
}

function  hide(){
    hint_text.style.display = 'none';
}

const Hint = {
    edit,
    show,
    hide
}

export default Hint;
