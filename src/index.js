import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import $ from 'jquery';


ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
);

$(".theme-switch").on("click", () => {
  $("body").toggleClass("light-theme");
});