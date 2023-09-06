// This JavaScript file allows users to press a button to copy content in a code block to a clipboard (added by josh-wong)
var codeBlocks = document.querySelectorAll('pre.highlight');

codeBlocks.forEach(function (codeBlock) {
  var copyButton = document.createElement('button');
  copyButton.className = 'copy';
  copyButton.type = 'button';
  copyButton.ariaLabel = 'Copy code to clipboard';
  copyButton.innerText = 'Copy';

  codeBlock.append(copyButton);

  copyButton.addEventListener('click', function () {
    var code = codeBlock.querySelector('code').innerText.replace("$ ", "").trim(); // Copy the code block, removing any leading `$ `
    window.navigator.clipboard.writeText(code);

    copyButton.innerText = 'Copied!';
    var threeSeconds = 3000;

    setTimeout(function () {
      copyButton.innerText = 'Copy';
    }, threeSeconds);
  });
});
