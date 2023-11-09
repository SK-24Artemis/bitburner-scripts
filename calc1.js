/** @param {NS} ns */
export async function main(ns) {
   ns.disableLog('ALL');
   ns.clearLog();
   ns.resizeTail
   ns.moveTail
   ns.setTitle(React.createElement('span', { style: { color: ns.ui.getTheme().int } }, "MM\'s GUI calc"));
   ns.tail();

   //CSSStyleDeclaration()
   ///REFERENCE////   
   ////SYNTAX///
   /*   const buttonGroup =()=>{
         return( [array of grouped (elements)]
      }*/
   //(React.createElement('button', { style: buttonNumGroupCSS, onClick:(()=>{ numberPressed(1)}) }, '1')
   //(React.createElement('button', { style:{color: "#ffd7V0"} }, 'Une'))
   //buttonGroup = () => { return ([[array of eles],[other array]])}
   //button = React.createElement('button', { style: myStyle ,onClick:changeBG}, message[0] + " I'\m a button");
   //[[(React.createElement('button', { style: buttonNumGroupCSS, onClick: displayUpdate}, '1')),...

   const outputDisplayCSS = {
      alignItems: 'center',
      //alignSelf:'stretch', //<< no effect?
      border: `3px ridge ${ns.ui.getTheme().primarylight}`,
      cursor: 'text',
      color: `${ns.ui.getTheme().infodark}`,
      display: 'flex',
      fontSize: "large",
      justifyContent: 'end',
      margin: '5px',
      marginBottom: '18px',
      minHeight: '20px',
      opacity: '90%',
      height: "85%",
      width: "92%",
      //top: "0px", // not the right method to fix display to tail top
      wordSpacing: "3px",
      //wordWrap: "break-word" // !! does not wrap ints until stringified?
   }

   const outputDisplayButton = () => {
      return (React.createElement('button', { style: outputDisplayCSS }, displayCurrent))
   }

   const buttonNumGroupCSS = {
      border: `3px ridge ${ns.ui.getTheme().primarylight}`,
      borderBottomRightRadius: '20px',
      boxShadow: "8px blue",
      color: `${ns.ui.getTheme().errordark}`,
      cursor: 'crosshair',
      //display: 'flex',
      flexDirection: 'row',
      fontSize: 'medium',//"15px",
      marginLeft: '5px',
      marginTop: '1.5px',
      opacity: '90%',
      padding: "2%",
      width: '21%',
   }

   const buttonBottomRowCSS = {
      border: `3px ridge ${ns.ui.getTheme().primarylight}`,
      boxShadow: "8px blue",
      color: `${ns.ui.getTheme().errordark}`,
      cursor: 'crosshair',
      // display: 'flex',
      fontSize: 'medium',//"15px",
      justifyContent: 'right',
      //alignContent: '',
      marginLeft: '5px',
      marginTop: '1.5px',
      opacity: '90%',
      padding: "2%",
      width: '21%',
   }

   const buttonTopRowCSS = {
      // align:'center',
      border: `3px ridge ${ns.ui.getTheme().primarylight}`,
      boxShadow: "8px blue",
      color: `${ns.ui.getTheme().errordark}`,
      cursor: 'crosshair',
      // display: 'flex',
      fontSize: 'small',//"15px",
      justifyContent: 'spaceAround',
      //alignContent: ''
      marginLeft: '5px',
      marginTop: '2px',
      opacity: '90%',
      padding: "2%",
      width: '21%',
      //wordBreak:'keepAll' // << doesn't work, not sure BB syntax needed.
   }

   const specialButtonCSS = {
      border: `3px ridge ${ns.ui.getTheme().primarylight}`,
      boxShadow: "8px blue",
      color: `${ns.ui.getTheme().errordark}`,
      cursor: 'crosshair',
      // display: 'flex',
      fontSize: 'small',//"15px",
      justifyContent: 'spaceAround',
      //alignContent: ''
      marginLeft: '5px',
      marginTop: '1px',
      opacity: '90%',
      padding: "1%",
      width: '21%',
   }

   let catButtonInitial = '🐈'
   let catButton = catButtonInitial
   const emojis = ['🐈', '🦝', '🐭', '🦘', '🐦', '🐳', '🦕', '🦝', '🐭', '🌷', '🌈', '✨']


   const buttonGroup = () => {
      return (
         [[(React.createElement('button', { style: specialButtonCSS, onClick: (() => { catPressed() }) }, catButton)),
         (React.createElement('button', { style: buttonTopRowCSS, onClick: (() => { clrButtonPressed(0) }) }, 'Clear')),
         (React.createElement('button', { style: specialButtonCSS, onClick: (() => { backButtonPressed() }) }, '⌫')),
         (React.createElement('button', { style: buttonTopRowCSS, onClick: (() => { operationPressed('/') }) }, '/'))],

         [(React.createElement('button', { style: buttonNumGroupCSS, onClick: (() => { numberPressed(1) }) }, '1')),
         (React.createElement('button', { style: buttonNumGroupCSS, onClick: (() => { numberPressed(2) }) }, '2')),
         (React.createElement('button', { style: buttonNumGroupCSS, onClick: (() => { numberPressed(3) }) }, '3')),
         (React.createElement('button', { style: buttonBottomRowCSS, onClick: (() => { starPressed() }) }, '*'))],

         [(React.createElement('button', { style: buttonNumGroupCSS, onClick: (() => { numberPressed(4) }) }, '4')),
         (React.createElement('button', { style: buttonNumGroupCSS, onClick: (() => { numberPressed(5) }) }, '5')),
         (React.createElement('button', { style: buttonNumGroupCSS, onClick: (() => { numberPressed(6) }) }, '6')),
         (React.createElement('button', { style: buttonBottomRowCSS, onClick: (() => { operationPressed('-') }) }, '-'))],

         [(React.createElement('button', { style: buttonNumGroupCSS, onClick: (() => { numberPressed(7) }) }, '7')),
         (React.createElement('button', { style: buttonNumGroupCSS, onClick: (() => { numberPressed(8) }) }, '8')),
         (React.createElement('button', { style: buttonNumGroupCSS, onClick: (() => { numberPressed(9) }) }, '9')),
         (React.createElement('button', { style: buttonBottomRowCSS, onClick: (() => { operationPressed('+') }) }, '+'))],

         [(React.createElement('button', { style: buttonBottomRowCSS, onClick: (() => { negativePressed() }) }, '+/-')),
         (React.createElement('button', { style: buttonBottomRowCSS, onClick: (() => { numberPressed(0) }) }, '0')),
         (React.createElement('button', { style: buttonBottomRowCSS, onClick: (() => { decimalPressed() }) }, '.')),
         (React.createElement('button', { style: buttonBottomRowCSS, onClick: (() => { equalPressed() }) }, '='))]]
      )
   }


   let displayDefaultMessage = 'hello'
   let displayCurrent = ''

   // regex test valid expressions>> button input can be concat'd //
   //                                                             //
   function numberPressed(x) {
      //this regex checks the full display expr, maybe? it's way more than needed to check if int can be concated
      //lol this regex is all optional!
      if (/((^[+-]?\d*\.?\d+)?(((?<![-\/+*])([\/+-](?!=\h*\*))?\*{0,2})?((?<!\d)\d*\.?\d+)?)*(\d*\.??)?)/gm.test(displayCurrent)) {
         displayCurrent = displayCurrent.concat(x);
         ns.clearLog();
         drawCalculator();
      }
   }
   function decimalPressed() {
      // if (/(?<=[-+\/*\d]|^)/m.test(displayCurrent)) {
      //if (/(?<!\.\d|\.)([-\d+\/*]|^)$/gm.test(displayCurrent)){
      //if (/(^[+-]?(\d*|\d*\.?\d+)(((?<![-\/+*])([\/+-](?!=\*))?\*{0,2})?)*)$/gm.test(displayCurrent)){
      //if (/^[+-]?(?:\d*|(\d*\.?\d+([-+\/]|\*{1,2}))*\d*)$/gm.test(displayCurrent)) { << //!! "830.+78" cannot concat \.  !!
      if (/^[+-]?(?:\d*|(?:(?:\d*\.?\d+|\d+\.\d*)(?:[-+\/]|\*{1,2}))*\d*)$/gm.test(displayCurrent)) {
         displayCurrent = displayCurrent.concat('.');
         ns.clearLog();
         drawCalculator();
      }
   }
   function operationPressed(z) { // 9+3** < < should a +6 be able to follow?
      if (/(?<![-+\/*]|(?<!\d)\.)$/gm.test(displayCurrent)) {
         displayCurrent = displayCurrent.concat(z);
         ns.clearLog();
         drawCalculator();
      }
   }
   function starPressed() { // 9+3** < < should a +6 be able to follow?
      if (/(?<![-+\/]|\*\*)$/g.test(displayCurrent)) {
         displayCurrent = displayCurrent.concat('*');
         ns.clearLog();
         drawCalculator();
      }
   }
   function equalPressed() {
      // is a valid simple expression (no parentheses, no factorial, no roots)
      if (/((?:^[+-]?\d*\.?\d+)(?:(?:(?<![-\/+*])(?:[\/+-]|\*{1,2})?(?:\d*\.?\d+)?))*)/m.test(displayCurrent)) {
         displayCurrent = JSON.stringify(eval(displayCurrent)); //JSON.parse and stringify not needed if .toFixed()
         ns.clearLog();
         drawCalculator();
      }
   }
   function negativePressed() {
      if (!/^[-]/.test(displayCurrent)) {
         displayCurrent = `-${displayCurrent}`;
         ns.clearLog();
         drawCalculator();
      }
      else {
         displayCurrent = displayCurrent.slice(1);
         ns.clearLog();
         drawCalculator();
      }
   }
   function backButtonPressed() {
      displayCurrent = displayCurrent.slice(0, -1);
      ns.clearLog();
      drawCalculator();
   }
   function clrButtonPressed() {
      displayCurrent = '';
      ns.clearLog();
      drawCalculator();
   }
   function catPressed() {
      catButton = emojis[Math.floor(Math.random() * emojis.length)];
      ns.clearLog();
      drawCalculator();
   }


   function drawCalculator() {
      ns.printRaw(outputDisplayButton());
      ns.printRaw(buttonGroup()[0]);
      ns.printRaw(buttonGroup()[1]);
      ns.printRaw(buttonGroup()[2]);
      ns.printRaw(buttonGroup()[3]);
      ns.printRaw(buttonGroup()[4]);
   }

   //   ns.atExit(()=> {clrButtonPressed();numberPressed(catButtonInitial+emojis[Math.floor(Math.random() * emojis.length)]+catButtonInitial)});
   //optional behavior to print emojis on script kill.
   //maybe expected behavior leaves the last number solution or equation visible.

   
   drawCalculator();
   while (true) {
      await ns.asleep(2500);
   }


}
