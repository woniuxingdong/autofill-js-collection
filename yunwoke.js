// A autofill script to do the bid operation

//Need to inject jquery first
injectJquery().then(function() {

    function triggerEvent(item, etype) {
        if(!etype)
            etype = 'input';

        var e = document.createEvent('HTMLEvents');
        e.initEvent(etype, true, true);
        console.log('Event to issue', item)
        item[0].dispatchEvent(e);
    }
    
    function project_price() {
        var price = 1000;
        var discount_rate = 0.85;
        //var platform_fee_rate = 0.1;
    
        //Client budget text{
        var txt = $('#proposal .num span').eq(0).text();
        var start = txt.indexOf('￥') + 1;
        var end = txt.length;
        var rangeTxt = txt.substr(start, end - start).replace(/,/g, '');
        console.log('rangeTxt', rangeTxt);

        //Client budget range
        var range = rangeTxt.split('~');
        console.log('Client price range', range);

        if(range.length == 2) {
            //budget have a range
            min_budget = parseInt(range[0]);
            max_budget = parseInt(range[1]);
        } else if (range.length == 1) {
            //Only have one budget value
            max_budget = min_budget = range[0];
        }

        //Higher than my lowest 
        if(max_budget * discount_rate > price) {
            price = max_budget * discount_rate;
        }

        //My price would never less than a client's min budget 
        if(price < min_budget) {
            price = min_budget;
        }

        return price
    }   

    function project_duration() { 
        //Client plan days
        client_duration = parseInt($('#proposal .num span').eq(1).text());
        console.log('client duration ', client_duration);

        choices = []
        $('#proposal select > option').each(function(i, item) {
            if( i > 0 ) { 
                choices.push(parseInt($(item).val()));
            }
        });
        console.log("choices ", choices);


        var idx = -1
        for(var i=0; i < choices.length; i++) {
            if(choices[i] == client_duration) {
                idx = i + 1;
                break;
            }
    
            if(choices[i] > client_duration && idx == -1) {
                idx = i + 1;
                break;
            }
        }

        return idx; 
    }   

    function apply_price(price){
        console.log("price is ", price);
        $('#proposal .bid-price input').val(price);
        triggerEvent($('#proposal .bid-price input'));
    }   

    function apply_duration(duration) {
        console.log("duration is ", duration);
        $('#proposal select').get(0).selectedIndex = duration;
        triggerEvent($('#proposal select'), 'change');
    }   

    
    apply_price(project_price());
    apply_duration(project_duration());

    console.log("bid done");                                                                                                                                                                   

});

