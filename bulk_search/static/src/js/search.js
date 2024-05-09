/** @odoo-module **/
import SystrayMenu from 'web.SystrayMenu';
import Widget from 'web.Widget';
import BasicController from 'web.BasicController';
import rpc from 'web.rpc';

var SystrayWidget = Widget.extend({
   template: 'SystraySearch',
   events: {
       'click .input' : '_onInput',
       'click .search_view' : '_OnClickSearch',
       'click .search_tag':'_Click',
   },

_onInput: function(){
    var self = this;
    var vals = $(".input").val();
    console.log('input', vals);
    var input = $(".input").val();
    var fields = [];
    rpc.query({
       model: 'search.record',
       method: 'search_read',
       args: [fields],
    }).then(function (Result) {
        console.log('Result', Result);
        var modelNames = Result.map(model => model.model_name);
        console.log('Model Names', modelNames);
        console.log('vals', vals);
        if (vals) {
            document.getElementById('drop_list').style.display='block';
            var resultsByModel = {};
            modelNames.forEach(function(modelName) {
                rpc.query({
                    model: modelName,
                    method: 'search_read',
                    args: [[['name', 'ilike', input]]],
                }).then(function (Result) {
                    if (Result.length !== 0){
                        console.log('Resultssssss', Result);
                        resultsByModel[modelName] = Result;
                        renderResults(resultsByModel);
                    }
                })
            })
        } else {
            document.getElementById('drop_list').style.display='none';
        }

    })

    function renderResults(resultsByModel) {
        $('.dropdown_view').empty();
        Object.keys(resultsByModel).forEach(function(modelName) {
            console.log("resultsByModel", resultsByModel);
            console.log("modelName", modelName);
            var results = resultsByModel[modelName];
            console.log("results", results);
            var Div = document.createElement('div');
            results.forEach(function(result) {
                 rpc.query({
                   model: 'ir.model',
                   method: 'search_read',
                   args: [[['model', '=', modelName]]],
                   }).then(function (Result) {
                        var name = Result[0]['name'];
                        var tag = document.createElement('div');
                        tag.classList.add("search_tag");
                        var resultText = document.createTextNode(name+ "/" + result.name);
                        tag.setAttribute("id", result.id);
                        tag.append(resultText);
                        Div.append(tag);
                   })
            });
            $('.dropdown_view').append(Div);
        });
    }
},

   _passvalue: function(current_model, res_ids){
           var self = this;
           console.log("ALL VALUES AND MODEL",current_model, res_ids);
            rpc.query({
                   model: 'ir.model',
                   method: 'search_read',
                   args: [[['model', '=', current_model]]],
                   }).then(function (Result) {
                        var name = Result[0]['name'];
                        self._openAction(name, current_model, res_ids);
                    })
   },


   _openAction: function(name, current_model, res_ids){
        console.log("ALL _OpenDirectMessage AND MODEL",name, current_model, res_ids);
        var self = this;
        self.do_action({
             type: 'ir.actions.act_window',
             name: name,
             res_model: current_model,
              domain: [['id', 'in',  res_ids]],
              views: [[false, 'list'], [false, 'form']],
              target: 'current',
        });
        $(".input").val('');
   },

   _OnClickSearch: function(ev){
        var self = this;
        var input = $(".input").val().trim();
        var inputValues = input.split(',').map(value => value.trim());
//        var domain = inputValues.length === 1 ? [['name', 'ilike', inputValues[0]]] : [['name', 'in', inputValues]];
        var domain = inputValues.length === 1 ? [['name', '=', inputValues[0]]] : [['name', 'in', inputValues]];
        var fields = [];
        rpc.query({
           model: 'search.record',
           method: 'search_read',
           args: [fields],
            }).then(function (Result) {
                console.log('Result', Result);
                var modelNames = Result.map(model => model.model_name);
                modelNames.forEach(function(modelName) {
                       rpc.query({
                       model: modelName,
                       method: 'search_read',
                       args: [domain],
                       }).then(function (Result) {
                            if (Result.length !== 0){
                                var res_ids = Result.map(function(item) {return item.id;});
                                var current_model = modelName
                                self._passvalue(current_model, res_ids);
                                document.getElementById('drop_list').style.display='none';
                            }
                       })
                })
            })
   },

_Click: function(ev){
    var name = $(ev.currentTarget).text();
    var firstSlashIndex = name.indexOf('/');
    if (firstSlashIndex !== -1) {
        var trimmedName = name.substring(firstSlashIndex + 1).trim();
        $(".input").val(trimmedName);
    } else {
        $(".input").val(name.trim());
    }
    document.getElementById('drop_list').style.display='none';
}





});

SystrayMenu.Items.push(SystrayWidget);
export default SystrayWidget;
