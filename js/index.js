window.onload = function () {
  
}


var map;
var markers = [];
var infoWindow;


function initMap() {
    var Srilanka = {
      lat: 6.927079, 
      lng: 79.861244
    };
    map = new google.maps.Map(document.getElementById('map'), {
      center: Srilanka,
      zoom: 11,
      mapTypeId: 'roadmap',
    });
    infoWindow = new google.maps.InfoWindow();

    displayStore(stores);
    showStoresMarkers(stores);
    setOnLClickListener();
   

}

function setOnLClickListener(){
  var storeElements = document.querySelectorAll('.store-container');

  storeElements.forEach(function (elem,index)
  {
    elem.addEventListener('click' , function(){
      new google.maps.event.trigger(markers[index], 'click');
    })
  })
}



function displayStore(stores){
   var storesHtml ='';

  for(var [index, store] of stores.entries())
  {
    var DistrictName = store['DistrictName'];
    var Province = store['Province'];
    var Curfew = store['Curfew'];
    var Zone = store['Zone'];
    
    storesHtml += ` 
    <div class="store-container">
      <div class="store-container-background">
          <div class="store-info-container">
              <div class="store-address">
                  <span>${DistrictName}</span> 
                   
              </div>
              <div class="store-province">
                  <span>${Province}</span>
              </div>
              <div class="store-Curfew">
                  ${Curfew}
              </div>
              <div class="store-Zone">
                  ${Zone}
              </div>
          </div>
          <div class="store-number-container">
              <div class="store-number">
                ${index+1}
              </div>
           </div>
      </div>
    </div>
    `
    document.querySelector('.stores-list').innerHTML = storesHtml;

  }
}

function showStoresMarkers(stores)
{
  var bounds = new google.maps.LatLngBounds();
  for(var [index , store] of stores.entries())
  {
    var latlng = new google.maps.LatLng(
        store["coordinates"]["latitude"],
        store["coordinates"]["longitude"]
    );
    var DistrictName = store["DistrictName"];
    var TotalPeople = store["TotalPeople"];
    var ActiveCases = store["ActiveCases"];
    var RecoveredCases = store["RecoveredCases"];
    var Deaths = store["Deaths"];



    bounds.extend(latlng);

    createMarker(latlng , DistrictName , TotalPeople , ActiveCases, RecoveredCases,Deaths, index+1);
  }
    map.fitBounds(bounds);
  }

function createMarker(latlng , DistrictName , TotalPeople , ActiveCases, RecoveredCases,Deaths, index)
{
  var html = `
            <div class="store-info-window">
              <div class="store-info-name">
                ${DistrictName}
              </div>
              <div class="store-info-totalpepole">
                Total People: ${TotalPeople}
              </div>
              <div class="store-info-activecases">
                <div class="circle">
                  <i class="fas fa-male"></i>
                </div>
                Active Cases:${ActiveCases}
              </div>
              <div class="store-info-recoveredcases">
                <div class="circle">
                <i class="fas fa-male"></i>
                </div>
                Recovered Cases:${RecoveredCases}
              </div>
              <div class="store-info-deaths">
                <div class="circle">
                <i class="fas fa-male"></i>
                </div>
               Deaths: ${Deaths}
              </div>
            </div>
  `;
  
          var marker = new google.maps.Marker({
            map: map,
            position: latlng,
            label: index.toString()
          });
          google.maps.event.addListener(marker, 'click', function() {
            infoWindow.setContent(html);
            infoWindow.open(map, marker);
          });
          markers.push(marker);
}


function searchStores()
{
  var foundStores = []
  var zipCode = document.getElementById('Zip-code-input').value;

    if(zipCode)
    {
      for(var store of stores)
          {
            var postal = store['DistrictName'];
            var postal1 = store['DistrictName1'];

              if(postal == zipCode)
              {
                foundStores.push(store);
              }
              if(postal1 == zipCode)
              {
                foundStores.push(store);
              }
          }
    }

    else{
      foundStores = stores;
    }
  
  clearLocations();
  displayStore(foundStores);
  showStoresMarkers(foundStores);
  setOnLClickListener();
}

function clearLocations() {
        infoWindow.close();
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        markers.length = 0;
      }