getInfinte();
//resizeAllGridItems();
getCategoryList();
callInitialView();

$(window).on('load', function () {
    resizeAllGridItems();
    imagesHaveLoaded();
});

//get related categories after button click
function getCategoryList() {
    $('input:button').click(function () {
        var category = $(this).val();
        $('#myDiv').empty();
        //JSON data
        var url = "Home/GetCategory";
        var dataType = 'application/json; charset=utf-8';
        var data = { 'Category': category };
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            contentType: dataType,
            data: data,
            success: function (result) {
                for (var image = 0; image < result.length; image++) {
                    resizeAllGridItems();
                    getInfinte();
                    $('#myDiv').append('<div class="item karya" id="ItemsId">'
                        + '<img src="' + result[image].images + '" width="100%" alt="Card image cap"/>'
                        + '<h4>Heading</h4>'
                        + '<p id="demo">This is some random text</p>'
                        + '</div>');
                }

                console.log('Data received: ');
                console.log(result);
            }, error: function (error) {
                alert("Unable to fetch data at this moment " + error);
            }
        });
    });
}
//when the page loads, load all of the content and all categories
function callInitialView() {
    var url = "Home/GetCategory";
    var dataType = 'application/json; charset=utf-8';
    var data = { 'Category': "0" };
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        contentType: dataType,
        data: data,
        success: function (result) {
            
            for (var image = 0; image < result.length; image++) {
                getInfinte();
                resizeAllGridItems();
                imagesHaveLoaded();
                $('#myDiv').append('<div class="item karya" id="ItemsId">'
                    + '<div class="content">'
                    + '<img src="' + result[image].images + '" width="100%" alt="Card image cap"/>'
                    + '<h4>Heading</h4>'
                    + '<p>This is some random text</p>'
                    + '</div>'
                    + '</div>');
                
            }
            
            console.log('Data received: ');
            console.log(result);
        }, error: function (error) {
            alert("Unable to fetch data at this moment " + error);
        }
    });
}
function getInfinte() {
    
    $(".karya").slice(16).hide();
    var mincount = 8;
    var maxcount = 16;

    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() >= $(document).height() - 50) {
            
            $(".karya").slice(mincount, maxcount).slideDown(350);
            mincount = mincount + 8;
            maxcount = maxcount + 16;
            resizeAllGridItems();
        }
    });
}

//=========================================================================================================================================

//resizeAllGridItems();
imagesHaveLoaded();

//window.addEventListener("load", resizeAllGridItems);
window.addEventListener("resize", resizeAllGridItems);

function resizeGridItem(item) {
    grid = document.getElementsByClassName("masonry")[0];
    rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
    rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
    rowSpan = Math.ceil((item.querySelector('.content').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
    item.style.gridRowEnd = "span " + rowSpan;
}

function resizeAllGridItems() {
    allItems = document.getElementsByClassName("item");
    for (x = 0; x < allItems.length; x++) {
        resizeGridItem(allItems[x]);
    }
}

function imagesHaveLoaded() {
    allItems = document.getElementsByClassName("item");
    for (x = 0; x < allItems.length; x++) {
        imagesLoaded(allItems[x], resizeInstance);
    }
}

function resizeInstance(instance) {
    item = instance.elements[0];
    resizeGridItem(item);
}
