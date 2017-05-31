class Cursor {
  preserve(element) {
    this.selection = {
      start: element.selectionStart,
      end: element.selectionEnd,
      element: element
    };
  }
  restore(transform) {
    this[transform.action](this.selection, transform);
  }
  insert(cursor, transform) {
    if(parseInt(transform.start) < cursor.start) {
      cursor.element.selectionStart = cursor.start + transform.payload.length;
      cursor.element.selectionEnd = cursor.end + transform.payload.length;
    } else if(parseInt(transform.start) >= cursor.start && parseInt(transform.start) < cursor.end) {
      cursor.element.selectionStart = cursor.start;
      cursor.element.selectionEnd = cursor.end + transform.payload.length;
    } else {
      cursor.element.selectionStart = cursor.start;
      cursor.element.selectionEnd = cursor.end;
    }
  }
  delete(cursor, transform) {
    if(parseInt(transform.start) < cursor.start) {
      cursor.element.selectionStart = cursor.start - parseInt(transform.remove);
      cursor.element.selectionEnd = cursor.end - parseInt(transform.remove);
    } else if(parseInt(transform.start) >= cursor.start && parseInt(transform.start) < cursor.end) {
      cursor.element.selectionStart = cursor.start;
      cursor.element.selectionEnd = cursor.end - parseInt(transform.remove);
    } else {
      cursor.element.selectionStart = cursor.start;
      cursor.element.selectionEnd = cursor.end;
    }
  }
  replace(cursor, transform) {
    if(parseInt(transform.start) < cursor.start) {
      cursor.element.selectionStart = cursor.start + (transform.payload.length - parseInt(transform.remove));
      cursor.element.selectionEnd = cursor.end + (transform.payload.length - parseInt(transform.remove));
    } else if(parseInt(transform.start) >= cursor.start && parseInt(transform.start) < cursor.end) {
      cursor.element.selectionStart = cursor.start;
      cursor.element.selectionEnd = cursor.end + (transform.payload.length - parseInt(transform.remove));
    } else {
      cursor.element.selectionStart = cursor.start;
      cursor.element.selectionEnd = cursor.end;
    }
  }
  noop(cursor) {
    cursor.element.selectionStart = cursor.start;
    cursor.element.selectionEnd = cursor.end;
  }
}

export default new Cursor();
