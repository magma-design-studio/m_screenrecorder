//import 'popper.js';
//import 'bootstrap';

/*
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'
*/

import './scripts/app.js';

//import './scripts/service-worker.js';


//import './styles/app.scss';

import(`./styles/app.scss`).then(module => {
    console.log(module);
});

