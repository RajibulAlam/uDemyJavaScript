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

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(current) {
            sum += current.value;
        }); 
        data.totals[type] = sum;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp:0,
            inc:0
        },
        budget: 0,
        percentage: -1
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

        calculateBudget: function() {
            calculateTotal('exp');
            calculateTotal('inc');
            
            data.budget = data.totals.inc - data.totals.exp;

            data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100);
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpense: data.totals.exp
            }
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
            inputButton: '.add__btn',
            incomeContainer: '.income__list',
            expensesContainer: '.expenses__list'
        };

        return {
            getInput: function() {
                return {
                    type: document.querySelector(DOMstrings.inputType).value,
                    description: document.querySelector(DOMstrings.inputDescription).value,
                    value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
                };
            },
            
            addListItem: function(obj, type) {
                // create HTML
                var html, newHtml, element;
                if(type === 'inc') {
                    element = DOMstrings.incomeContainer;
                    html = '<div class="item clearfix" id="income-%id%">' +
                                '<div class="item__description">%description%</div>' +
                                    '<div class="right clearfix">'+
                                    '<div class="item__value">%value%</div>'+
                                    '<div class="item__delete">'+
                                        '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
                } else if( type === 'exp') {
                    element = DOMstrings.expensesContainer;
                    html = '<div class="item clearfix" id="expense-%id%">'+
                                '<div class="item__description">%description%</div>'+
                                '<div class="right clearfix">'+
                                    '<div class="item__value">%value%</div>'+
                                    '<div class="item__percentage">21%</div>'+
                                    '<div class="item__delete">'+
                                        '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
                }
                //replace the place holders
                newHtml = html.replace('%id%', obj.id).replace('%description%',obj.description).replace('%value%',obj.value);

                //insert tthe html into the DOM
                document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            },

            clearFields: function() {
                var fields, fieldsArray;
                fields =  document.querySelectorAll(DOMstrings.inputDescription + ','+DOMstrings.inputValue);
                fieldsArray = Array.prototype.slice.call(fields);

                fieldsArray.forEach(function(current, index, array) {
                    current.value = "";
                });

                fieldsArray[0].focus();
            },

            getDOMstrings: function() {
                return DOMstrings;
            }
        };
})();

var appContoller = (function(budgetCtrl, UICtrl){

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

    var updateBudget = function() {
        //calculate budget
        budgetCtrl.calculateBudget();
        // return tthe budget
        var budget = budgetCtrl.getBudget();
        console.log(budget);
        // display the budget in UI
    };
    

    var ctrlAddItem = function() {
        var input, newItem;
        
        input =UICtrl.getInput();
        console.log(input);

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            newItem = budgetCtrl.addItem(input.type,input.description,input.value);
        
            UICtrl.addListItem(newItem,input.type);

            UICtrl.clearFields();
        
            //calculate and update budget
            updateBudget();
        }
       
    }

    return  {
        init: function() {
            console.log('Application started');
            setupEventListeners();
        }
    }
 
})(budgetController,UIController);

appContoller.init();