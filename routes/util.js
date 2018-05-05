/*
 * GET users listing.
 */
exports.getCurrentMonth = function() {
  var d = new Date();
  if (d.getMonth() >= 3)
    return d.getMonth() - 2;
  else
    return d.getMonth() + 10;
};

/*

assignCopy(){
    this.filteredItems = Object.assign([], this.entities);
}


filterItem(value){
    if(!value) this.assignCopy(); //when nothing has typed
    this.filteredItems = Object.assign([], this.entities).filter(
        item => item.entityType.toLowerCase().indexOf(value.toLowerCase()) > -1
    )
  }
*/
