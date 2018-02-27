/*------------------------------------------------------------

Modifier l'ordre +x / -x
Modifier l'ordre d'affichage (meta data)
Ajouter meta data (id, nom, status, datecréa, datemodif)
  meta status √
Modifier meta data
  meta status √
  
En cours :
  fonction modif content remplacée par modif meta
  fonction modif meta récupère les params mais n'apporte pas les modifs
    à élucider : utliser un param dans func(param) pour modifier un obj.param
    peut-être ${param} ?

------------------------------------------------------------*/

// VARIABLES

// var array_work;
if (storageAvailable('localStorage')) {
  if (!localStorage.getItem('myarray')) {
    var array_work = [
      {content:"ligne1",status:0},
      {content:"ligne2",status:1}
    ];
  } else {
    // array_work 1ère déclaration
    var array_work = JSON.parse(localStorage.getItem('myarray'));
  }
} else {
  console.log('localStorage unavailable 1st chk failed');
}

// FUNCTIONS

function storageAvailable(type) {
  //console.log('storageAvailable');
  try {
    var storage = window[type], x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch(e) {
    return e instanceof DOMException && (
      e.code === 22 ||
      e.code === 1014 ||
      e.name === 'QuotaExceededError' ||
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      storage.length !== 0;
  }
}

function showlist(array) {
  console.log('showlist');
  var output = "";
  array_l = array.length;
  for (var i = 0; i < array_l; i++) {
    output += '<li class="'+((array[i].status)?'checked':'')+'"><input type="checkbox" data-id="'+i+'"'+((array[i].status)?' checked':'')+'>'+array[i].content+'&nbsp;'
      + ((i > 0) ? '<button class="up fa fa-caret-up" data-id="'+i+'" aria-hidden="true"></button>' : '')
      + ((i < array_l - 1) ? '<button class="dn fa fa-caret-down" data-id="'+i+'" aria-hidden="true"></button>' : '')
      +'<button class="edit fa fa-pencil" data-id="'+i+'" aria-hidden="true"></button>'
      +'<button class="del fa fa-trash-o" data-id="'+i+'" aria-hidden="true"></button>'
      +'</li>\r';
  }
  return output;
}

function loadarray() {
  console.log('loadarray');
  if (storageAvailable('localStorage')) {
	  //console.log('localStorage ready');
    if(!localStorage.getItem('myarray')) {
      // array_work déjà déclaré
      array_work = JSON.parse(localStorage.getItem('myarray'));
    } else {
      console.log('myarray not found');
    }
  } else {
    console.log('localStorage unavailable');
  }
}

function savearray() {
  console.log('savearray');
  if (storageAvailable('localStorage')) {
    //console.log('localStorage ready');
    //console.log(typeof array_work);
    localStorage.setItem('myarray', JSON.stringify(array_work));
    $('#maliste').html(showlist(array_work));
  } else {
    console.log('localStorage unavailable');
  }
}

function addline() {
  console.log('addline');
  if ($('#enter').val()) {
    array_work.push({"content":$('#enter').val()});
  } else {
    window.alert('enter null');
  }
  savearray();
}

function delline(get) {
  console.log('delline');
  array_work.splice(get.data('id'),1);
  savearray();
}

function editline_get(get) {
  console.log('editline_get ' + get.data('id'));
  $('#edit').val(array_work[get.data('id')].content);
  $('#editid').val(get.data('id'));
  $('#edit_submitbutton').data('id',get.data('id'));
}

function editline_save() {
  console.log('editline_save');
  var content = $('#edit').val();
  var id = $('#editid').val();
  if (id && content) {
    array_work.splice(id,1,{"content":content});
  } else {
    window.alert('enter null');
  }
  // empty edit form
  $('#edit').val('');
  $('#editid').val('');
  $('#edit_submitbutton').data('id','');
  savearray();
}

function move_up(get) {
  console.log('move_up ' + get.data('id'));
  // ligne suppérieure
  var upid = get.data('id') - 1;
  var upline = array_work[upid];
  // ligne courante
  var curid = get.data('id');
  var curline = array_work[curid];
  // remplacer ligne suppérieure
  array_work.splice(upid,1,curline);
  // remplacer ligne courante
  array_work.splice(curid,1,upline);
  savearray();
}

function move_down(get) {
  console.log('move_down ' + get.data('id'));
  // ligne inférieure
  var dnid = get.data('id') + 1;
  var dnline = array_work[dnid];
  // ligne courante
  var curid = get.data('id');
  var curline = array_work[curid];
  // remplacer ligne inférieure
  array_work.splice(dnid,1,curline);
  // remplacer ligne courante
  array_work.splice(curid,1,dnline);
  savearray();
}

function change_meta(get,param,value) {
  console.log('change_meta');
  console.log('get data id : ' + get.data('id'));
  console.log('param : ' + param);
  console.log('value : ' + value);
  console.log('array_work[get.data(id)].param : ' + array_work[get.data('id')].param);
  array_work[get.data('id')].param = value;
  savearray();
}

// LISTENERS

document.addEventListener('DOMContentLoaded',function(){
  $('#maliste').html(showlist(array_work));
});

$('#enter_submitbutton').on('click',function(){event.preventDefault(); addline();});
//$('#edit_submitbutton').on('click',function(){event.preventDefault(); editline_save();});
$('#edit_submitbutton').on('click',function(){event.preventDefault(); change_meta($(this),'content',$('#edit').val());});

$('ul').on('click','.del',function(){event.preventDefault(); delline($(this));});
$('ul').on('click','.up',function(){event.preventDefault(); move_up($(this));});
$('ul').on('click','.dn',function(){event.preventDefault(); move_down($(this));});
$('ul').on('click','.edit',function(){event.preventDefault(); editline_get($(this));});
$('ul').on('change','[type=checkbox]',function(){event.preventDefault(); change_meta($(this),'status',!array_work[$(this).data('id')].status);});
