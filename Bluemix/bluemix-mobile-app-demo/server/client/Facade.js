(function(){

  function Facade(){

    var API_URL = "/api/Items";

    function getAllItems(){
      return $.get(API_URL)
    }

    function getItem(itemId){
      return $.get(API_URL + "/" + itemId);
    }

    /*function addNewItem(text, urgency){
      var item = {
        "text": text,
        "urgency": urgency,
        "isDone": false
      }*/
    function addNewItem(text){
      var item = {
        "text": text,
        "isDone": false
      }

      return $.ajax( {
        url:API_URL,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(item)
      });
    }

    /*function updateItem(id, text, urgency){
      var item = {
        "text": text,
        "urgency": urgency
      }*/
    function updateItem(id, text){
      var item = {
        "text": text
      }

      return $.ajax( {
        url:API_URL + "/" + id,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(item)
      });
    }

    function markItemDone(id, state){
      var item = {
        "isDone": state
      }

      return $.ajax( {
        url:API_URL + "/" + id,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(item)
      });
    }

    function deleteItem(id){
      return $.ajax( {
        url:API_URL + "/" + id,
        method: "DELETE"
      });
    }

    return {
      getAllItems:getAllItems,
      getItem:getItem,
      addNewItem:addNewItem,
      updateItem:updateItem,
      markItemDone: markItemDone,
      deleteItem:deleteItem
    }

  }

  window.Facade = new Facade();

}());
