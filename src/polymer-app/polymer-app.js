import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button/paper-icon-button.js';

import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@vaadin/vaadin-date-picker/vaadin-date-picker.js';

//import '@polymer/iron-ajax';
import '@polymer/paper-button';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-column-group.js'
import '@vaadin/vaadin-grid/src/vaadin-grid-templatizer.js';
import '@vaadin/vaadin-grid/src/vaadin-grid-styles.js';



// Set Polymer's root path to the same value we passed to our service worker
setPassiveTouchGestures(true);
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

/**
 * @customElement
 * @polymer
 */
class PolymerApp extends PolymerElement {
  static get template() {
    return html`
    <style>
    :host {
      --app-primary-color: #4285f4;
      --app-secondary-color: black;
      display: block;
    }
    app-drawer-layout:not([narrow]) [drawer-toggle] {
      display: none;
    }
    app-header {
      color: #fff;
      background-color: var(--app-primary-color);
    }
    app-header paper-icon-button {
      --paper-icon-button-ink-color: white;
    }
    .drawer-list {
      margin: 0 20px;
    }
    .drawer-list a {
      display: block;
      padding: 0 16px;
      text-decoration: none;
      color: var(--app-secondary-color);
      line-height: 40px;
    }
    .drawer-list a.iron-selected {
      color: black;
      font-weight: bold;
    }
  </style>
  <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
  </app-location>
  <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
  </app-route>
  <app-drawer-layout fullbleed="" narrow="{{narrow}}">
    <!-- Drawer content -->
    <app-drawer id="drawer" slot="drawer" swipe-open="[[narrow]]">
      <app-toolbar>Menu</app-toolbar>
      <iron-selector selected="[[page]]" attr-for-selected="name"
       class="drawer-list" role="navigation">
        <a name="list" route="{{route}}" href="[[rootPath]]list">details</a>
        <a name="detail" route="{{route}}" href="[[rootPath]]detail">detail</a>
        <a name="report" route="{{route}}" href="[[rootPath]]report">report</a>
        <a name="barchart" route="{{route}}" href="[[rootPath]]barchart">chart</a>
       
      </iron-selector>
    </app-drawer>
    <!-- Main content -->
    <app-header-layout has-scrolling-region="">
      <app-header slot="header" condenses="" reveals="" effects="waterfall">
        <app-toolbar>
          <paper-icon-button icon="my-icons:menu" drawer-toggle=""></paper-icon-button>
          <div main-title="">Transaction Details</div>
        </app-toolbar>
      </app-header>
      <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
        <transaction-list route="{{route}}" name="list"></transaction-list>
        <transaction-detail route="{{route}}" name="detail" totalbalance = "{{totalbalance}}"></transaction-detail>            
        <transaction-report route="{{route}}" name="report"> </transaction-report>
        <bar-chart route="{{route}}" name="barchart"></bar-chart>
        <not-found name="view404"></not-found>
      </iron-pages>
    </app-header-layout>
  </app-drawer-layout>
`;
}

static get properties() {
return {
  page: {
    type: String,
    reflectToAttribute: true,
    observer: '_pageChanged'
  },
  routeData: Object,
  subroute: Object
};
}

static get observers() {
return [
    '_routePageChanged(routeData.page)'
];
}

_routePageChanged(page) {
 // Show the corresponding page according to the route.
 //
 // If no page was found in the route data, page will be an empty string.
 // Show 'view1' in that case. And if the page doesn't exist, show 'view404'.
if (!page) {
  this.page = 'list';
} else if (['list', 'detail','report','barchart'].indexOf(page) !== -1) {
  this.page = page;
} else {
  this.page = 'view404';
}

// Close a non-persistent drawer when the page & route are changed.
if (!this.$.drawer.persistent) {
  this.$.drawer.close();
}
}


_pageChanged(page) {    
switch (page) {
  case 'list':
    import('./transaction-list.js');
    break;
  case 'detail':
    import('./transaction-detail.js');
    break;
    case 'report':
    import('./transaction-report.js');
    case 'barchart' :
    import('./bar-chart.js');
  case 'view404':
    import('./not-found.js');
    break;
}
}

}

window.customElements.define('polymer-app', PolymerApp);
