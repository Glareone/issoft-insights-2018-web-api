export const handleDrop = event => {
  event.preventDefault();
  const dataItems = event.dataTransfer.items; //DataTransferItemList object
  for (let i = 0; i < dataItems.length; i += 1) {
    if (dataItems[i].kind === 'string' && dataItems[i].type.match('^text/plain')) {
      dataItems[i].getAsString(function (s) {
        console.log('... Drop: Text');
        const draggableItem = document.getElementById(s);
        if(event.target.id === 'trash') {
          draggableItem.parentElement.removeChild(draggableItem);
        } else {
          event.target.appendChild(document.getElementById(s));
        }
      });
    } else if (dataItems[i].kind === 'string' && dataItems[i].type.match('^text/html')) {
      console.log('... Drop: HTML');
    } else if (dataItems[i].kind === 'string' && dataItems[i].type.match('^text/uri-list')) {
      console.log('... Drop: URI');
    } else if (dataItems[i].kind === 'file' && dataItems[i].type.match('^image/')) {
      const f = dataItems[i].getAsFile();
      const reader = new FileReader();
      reader.onload = ({target: {result}}) => {
        const image = document.createElement('img');
        image.src = result;
        image.draggable = true;
        image.id = `fileImg-${Date.now()}`;
        addListenersForDragging(image);
        event.target.appendChild(image);
      };

      reader.readAsDataURL(f);
      console.log('... Drop: File ');
    }
  }
  event.target.classList.remove('isOver');
};
