this.onmessage = function (e) {

  try {
      for (var i = 0; i < e.data.length; i++) {
          var phase = Math.sin((document.body.scrollTop / 1250) + (i % 5));
          postMessage({'i': i, 'left': e.data[i].basicLeft + 100 * phase + 'px'});
      }
  } catch (e) {
      function ScrollException(message) {
          this.name = 'ScrollException';
          this.message = message;
      };
      throw new ScrollException('Scroll error');
      postMessage(undefined);
  }
};