import React, {Component} from 'react';
import routesConfiguration from '../../routing/routesConfiguration';
import './DragAndDrop.less';

const {dragAndDrop} = routesConfiguration;

class DragAndDrop extends Component {

  componentDidMount() {
    function addListenersForDragging(element) {
      element.addEventListener('dragstart', handleDragStart);
      element.addEventListener('drag', handleDrag);
      element.addEventListener('dragend', handleDragEnd);
    }

    function addListenersForDropping(element) {
      element.addEventListener('drop', handleDrop);
      element.addEventListener('dragover', handleDragOver);
      element.addEventListener('dragleave', handleDragLeave);
    }

    document.querySelectorAll('.draggableItem').forEach(addListenersForDragging);
    document.querySelectorAll('.dropTarget').forEach(addListenersForDropping);
    const trash = document.getElementById('trash');
    addListenersForDropping(trash);

    function handleDragStart(event) {
      event.dataTransfer.setData('text/plain', event.target.id);
      event.target.classList.add('isDragStarted');
      event.dataTransfer.dropEffect = 'move';
    }

    function handleDragOver(event) {
      event.preventDefault(); // preventing touch and pointer events
      event.target.classList.add('isOver');
      event.dataTransfer.dropEffect = 'move';
    }

    function handleDrop(event) {
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
              document.getElementById(s) && event.target.appendChild(document.getElementById(s));
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
    }

    function handleDragLeave(event) {
      event.target.classList.remove('isOver');
    }

    function handleDrag(event) {
      event.target.classList.add('isDragged');
    }

    function handleDragEnd(event) {
      event.target.classList.remove('isDragged');
      event.target.classList.remove('isDragStarted');
    }

    function handleFileSelect(evt) {
      evt.stopPropagation();
      evt.preventDefault();

      const files = evt.dataTransfer.files; // FileList object.

      // files is a FileList of File objects. List some properties.
      const output = [];
      for (let i = 0, f; f = files[i]; i++) {
        output.push('<li><strong>', f.name, '</strong> (', f.type || 'n/a', ') - ',
          f.size, ' bytes, last modified: ',
          f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
          '</li>');
      }
      document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
    }
  }

  render() {
    return (
      <div className="pageWrapper dragAndDrop">
        <h3
          className="pageIdentificator"
        >
          {dragAndDrop.title}
        </h3>
        <h2>{dragAndDrop.title}</h2>
        <div className="dropTarget">
          <div
            id="draggable1"
            className="draggableItem"
            draggable="true"
          >
            This element is draggable.
          </div>
          <ul
            id="draggable2"
            className="draggableItem"
            draggable="true"
          >
            <li>First element</li>
            <li>Second element</li>
            <li>Third element</li>
          </ul>
          <img
            id="draggable3"
            className="draggableItem"
            src="https://networksynapse.net/wp-content/uploads/2016/08/js-e1472086839814.jpg"
            alt="image"
          />
        </div>
        <div className="dropTarget"/>
        <div id="panel" className="panel">
          <div id="pb">Drag Me</div>
        </div>
        <div id="trash" className="trash"/>
      </div>
    );
  }
}

export default DragAndDrop;
