var budgetController = ( function () {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp:0,
            inc:0
        }
    };

    return {
        addItem: function (type, itemDesc, itemValue) {
            var newItem;
            var ID = 0;

            if (data.allItems[type].length>0) {
                ID = data.allItems[type][data.allItems[type].length -1].id + 1; 
            }
            //Math.round(Math.random() * 100);

            if( type === 'exp') {
                newItem = new Expense(ID, itemDesc, itemValue);
            }  else if (type === 'inc') {
                newItem = new Income(ID, itemDesc, itemValue);
            }

            data.allItems[type].push(newItem);
            return newItem; 
        },

        testing: function() {
            console.log(data);
        }
    }

})();


var UIController = (function () {

        var DOMstrings = {
            inputType: '.add__type',
            inputDescription: '.add__description',
            inputValue: '.add__value',
            inputButton: '.add__btn'
        };

        return {
            getInput: function() {
                return {
                    type: document.querySelector(DOMstrings.inputType).value,
                    description: document.querySelector(DOMstrings.inputDescription).value,
                    value: document.querySelector(DOMstrings.inputValue).value
                };
            },
            
            addListItem: function(obj, type) {
                // create HTML

                '<div class="item clearfix" id="income-0">' +
                    '<div class="item__description">Salary</div>' +
                    '<div class="right clearfix">'+
                        '<div class="item__value">+ 2,100.00</div>'+
                        '<div class="item__delete">'+
                            '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>'+
                        '</div>'+
                    '</div>'+
                '</div>'



            },

            getDOMstrings: function() {
                return DOMstrings;
            }
        };
})();

var appContoller = (function(bugetCtrl, UICtrl){

    var setupEventListeners = function () {
        var DOMstrings =UICtrl.getDOMstrings();
        document.querySelector(DOMstrings.inputButton).addEventListener('click', ctrlAddItem);
        document.addEventListener ('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13)
            {
                ctrlAddItem(); 
            }
        });
    };

    

    var ctrlAddItem = function() {
        var input, newItem;
        
        input =UICtrl.getInput();

        newItem = budgetController.addItem(input.type,input.description,input.value);
        console.log(input);
    }

    return  {
        init: function() {
            console.log('Application started');
            setupEventListeners();
        }
    }
 
})(budgetController,UIController);

appContoller.init();