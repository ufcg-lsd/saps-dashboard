(function init(){
	
	var lnItemsListApi = {
		
		"NLItemsList": function(config){

			/*Constants*/
			var CLASS_LNIL_COMP = "lnil-comp";
			var CLASS_LNIL_COMP_PERMANENT_INPUT = "lnil-comp-permanent-input";
			var CLASS_INPUT="lnil-input";
			var CLASS_INPUT_HIDDEN = "lnil-input-hidden";
			var CLASS_INPUT_EDIT = "lnil-input-edit";
			var CLASS_LNIL_ITEM="lnil-item"
			var CLASS_LNIL_ITEM_REMOVER="lnil-item-remover"

			var ID_INPUT = "-input-new-item-id";
			var ID_INPUT_EDIT = "-input-edit-item-id";
			var ID_LIST_ITEM = "-item-id-";
			var ID_REMOVE_POSFIX = "-remove";

			var inputListSize = 0; //Default value
			var paddingFix = 10;
			var inputMinSize = 150;
			var hiddenInputMinSize = 20;
			var editItemPaddingFix = 10;
			var itemsListElementId = undefined;
			var itemsList = [];
			var itemsHtmlIdCounter = 0;
			var lnilConfig;

			var eventHandlers = {
				additem:undefined,
				removeitem:undefined,
				listchange:undefined,
			}
			
			var getItems = function(){
				var itemsToReturn = [];
				itemsList.forEach(function(lnilItem,index){
					itemsToReturn.push(lnilItem.item);
				})
				return itemsToReturn;
			};
			var getKeys = function(){
				var itemsToReturn = [];
				itemsList.forEach(function(lnilItem,index){
					itemsToReturn.push(lnilItem.item.key);
				})
				return itemsToReturn;
			};
			var getValues = function(){
				var itemsToReturn = [];
				itemsList.forEach(function(lnilItem,index){
					itemsToReturn.push(lnilItem.item.value);
				})
				return itemsToReturn;
			};
			/*Config:
			{
				target: id of the div
				items:[previous inputs]
				options:{
					width: size in pixels of the input list
					editButton
					permanentInput: true or false
					addOnFocusout: true ou false (default:false)
				}
				keyGenerator: function to generate keys for the values
				valueValidator: funtion to return true or false after validate de value for the item.
			}
			*/
			var newItemsList = function(config){

				lnilConfig = config;
				if(lnilConfig && lnilConfig.target){

					ID_INPUT = lnilConfig.target+ID_INPUT;
					ID_INPUT_EDIT = lnilConfig.target+ID_INPUT_EDIT;
					ID_LIST_ITEM = lnilConfig.target+ID_LIST_ITEM;

					var newItemsListApi ={
						on:function(event, callbackFunction){
							if(event == 'additem'){
								eventHandlers.additem = callbackFunction;
							}else if(event == 'removeitem'){
								eventHandlers.removeitem = callbackFunction;
							}else if(event == 'listchange'){
								eventHandlers.listchange = callbackFunction;
							}
						},
						getItems: getItems,
						getKeys: getKeys,
						getValues: getValues,
						edit:function(){

						}
					}
					
					itemsListElementId = lnilConfig.target;

					var itemsListElement = $('#'+itemsListElementId);
					if(lnilConfig.options && lnilConfig.options.width){
						inputListSize = lnilConfig.options.width;
						itemsListElement.css('width', inputListSize);
					}else{

						inputListSize = itemsListElement.width();
					}

					if(lnilConfig.options.permanentInput){
						itemsListElement.addClass(CLASS_LNIL_COMP_PERMANENT_INPUT);
					}else{
						itemsListElement.addClass(CLASS_LNIL_COMP);
					}

					addInputElement();

					if(lnilConfig.items){
						lnilConfig.items.forEach(function(item,index){
							if(item){
								if(typeof item === "object"){
									addPreviousItem(item.key, item.value)
								}
								if(typeof item === "string"){
									addPreviousItem('', item)
								}	
							}
						})
					}
					
					return newItemsListApi;

				}else{
					//error: no valid configuration
					console.log('Error on lnil')
				}
			}


			var addInputElement = function(){
				
				var itemsListElement = $('#'+itemsListElementId);

				itemsListElement.append('<input id="'+ID_INPUT
					+'" class="'+CLASS_INPUT
					+'" type="text"></input>');
				
				var inputElement = $('#'+ID_INPUT);
				resizeInput(ID_INPUT);

				if(!lnilConfig.options.permanentInput){
					hideInput();
					inputElement.on('click',showInput);
				}
				
				inputElement.focusout(function(){
					if(lnilConfig.options.addOnFocusout){
						var value = inputElement.val();
						addNewItem('', value);
					}else if(!lnilConfig.options.permanentInput){
						inputElement.val('');
					}
					if(!lnilConfig.options.permanentInput){
						hideInput();
					}
					
				});
				
				inputElement.keypress(function (e) {
				  if (e.which == 13) {

				   	var value = inputElement.val();
					addNewItem('', value);
					if(!lnilConfig.options.permanentInput){
						hideInput();
						inputElement.blur();
					}
					inputElement.val('');

				    return false;
				  }
				});
				
			}

			var addItem = function(lnilItem, inputId){

				var buttonRemoveId = lnilItem.htmlId+ID_REMOVE_POSFIX;
				
				var stringNewItem = '<div id="'+lnilItem.htmlId
						+'" class="'+CLASS_LNIL_ITEM+'" value="'+lnilItem.item.value
						+'">'+lnilItem.item.value
						+'</div>';

				$(stringNewItem).insertBefore('#'+inputId)
				
				var newItemElement = $('#'+lnilItem.htmlId)
				newItemElement.on('click', function(){
					handleEditItemEvent(lnilItem.htmlId);
				})

				newItemElement.append('&nbsp;<button type="button" id="'+buttonRemoveId
				+'" class="'+CLASS_LNIL_ITEM_REMOVER
				+'" aria-label="Close"><span aria-hidden="true">&times;</span></button>')

				var buttoRemoveElement = $('#'+buttonRemoveId);
				buttoRemoveElement.on('click', function(){
					removeItem(lnilItem.htmlId);
				})
				
				

			}

			var addNewItem = function(key,value){
				
				if(isStringEmpty(key) && lnilConfig.keyGenerator){
					key = lnilConfig.keyGenerator(value);
				}
				
				var valid = true;
				if(lnilConfig.valueValidator){
					valid = lnilConfig.valueValidator(value);
				}

				if(valid){

					var newItemId = ID_LIST_ITEM+(++itemsHtmlIdCounter);

					var lnilItem = {
						htmlId:newItemId,
						item:{
							key:key,
							value:value
						},
					}

					itemsList.push(lnilItem);

					$('#'+ID_INPUT).val('');
					addItem(lnilItem, ID_INPUT);
					resizeInput(ID_INPUT);

					if(eventHandlers.additem){
						eventHandlers.additem(lnilItem.item)
					}
					if(eventHandlers.listchange){
						eventHandlers.listchange(getItems())
					}
				}
			}

			var addPreviousItem = function(key,value){
				
				if(isStringEmpty(key) && lnilConfig.keyGenerator){
					key = lnilConfig.keyGenerator(value);
				}
				var newItemId = ID_LIST_ITEM+(++itemsHtmlIdCounter);

				var lnilItem = {
					htmlId:newItemId,
					item:{
						key:key,
						value:value
					},
				}

				itemsList.push(lnilItem);

				$('#'+ID_INPUT).val('');
				addItem(lnilItem, ID_INPUT);
				resizeInput(ID_INPUT);

			}

			var handleEditItemEvent = function(htmlId){

				//Disable Input
				if(lnilConfig.options.permanentInput){
					hideInput();
				}
				
				$('#'+ID_INPUT).hide();
				var itemToEditElement = $('#'+htmlId);

				
				var itemSize = itemToEditElement.outerWidth();
				
				var inputEditHtml = '<input id='+ID_INPUT_EDIT
					+' class="'+CLASS_INPUT_EDIT
					+'" type="text"></input>';
				
				var oldValue = itemToEditElement.attr('value');

				$(inputEditHtml).insertBefore(itemToEditElement);
				itemToEditElement.remove();

				var inputEditElement = $('#'+ID_INPUT_EDIT);

				inputEditElement.val(oldValue);

				resizeInput(ID_INPUT_EDIT);
				
				inputEditElement.focusout(function(){
					//alert($('#'+inputId).val());
					var newValue = inputEditElement.val();
					updateItem(htmlId,newValue);
					
					
				});
				
				inputEditElement.keypress(function (e) {
				  if (e.which == 13) {

				   	var newValue = inputEditElement.val();
					updateItem(htmlId,newValue);
				    return false;
				  }
				});

				inputEditElement.focus();
				
			}

			var updateItem = function(htmlId, newValue){

				var valid = true;
				if(lnilConfig.valueValidator){
					valid = lnilConfig.valueValidator(newValue);
				}

				var updatedLnilItem;

				for(var index = 0; index < itemsList.length; index++){
					if(itemsList[index].htmlId == htmlId){
						if(valid){
							itemsList[index].item.value = newValue;
						}
						updatedLnilItem = itemsList[index];
						break;
					}
				}

				
				addItem(updatedLnilItem, ID_INPUT_EDIT);
				$('#'+ID_INPUT_EDIT).remove();
				$('#'+ID_INPUT).show();
				resizeInput(ID_INPUT);

				if(lnilConfig.options.permanentInput){
					showInput();
				}
				
			}

			var removeItem = function(itemId){
				
				var itemToRemove = $('#'+itemId);

				itemToRemove.remove();

				var indexToRemove = undefined;
				var lnilItemToRemove = undefined;

				resizeInput(ID_INPUT);

				for(var index = 0; index < itemsList.length; index++){
					if(itemsList[index].htmlId == itemId){
						indexToRemove = index;
						lnilItemToRemove = itemsList[index].item
						break;
					}
				}
				
				if(indexToRemove){
					itemsList.splice(indexToRemove, 1);
				}

				if(eventHandlers.removeitem){
					eventHandlers.removeitem(lnilItemToRemove)
				}
				if(eventHandlers.listchange){
					eventHandlers.listchange(getItems())
				}

			}

			var hideInput = function(){

				var inputElement = $('#'+ID_INPUT);
				inputElement.addClass(CLASS_INPUT_HIDDEN);
			    // inputElement.removeClass(CLASS_INPUT);
				
			}
			var showInput = function(){

				var inputElement = $('#'+ID_INPUT);
				// inputElement.addClass(CLASS_INPUT);
				if(inputElement.outerWidth() < inputMinSize){
					inputSize = (inputListSize - paddingFix);
					inputElement.css('width',inputSize);
				}
			    inputElement.removeClass(CLASS_INPUT_HIDDEN);
				
			}

			var resizeInput = function(inputId){

				var lineSize = 0;

				var itemsListElement = $('#'+itemsListElementId);
				inputListSize = itemsListElement.width();

				itemsListElement = $('#'+itemsListElementId);
				
				itemsListElement.children().each(function(){
					//Input elements will not be considerated
					if($(this).prop("id") == ID_INPUT ||
						$(this).prop("id") == ID_INPUT_EDIT){
						// console.log('Stoping loop')
						return false;
					}
					// console.log('Continuing loop')
					lineSize = lineSize+$(this).outerWidth();
					if(lineSize > (inputListSize - paddingFix)){
						lineSize = $(this).outerWidth();
					}
				})

				var inputElement = $('#'+inputId);
				var inputSizePixel = (inputListSize - lineSize - paddingFix);

				var minSize = lnilConfig.options.permanentInput ? inputMinSize:hiddenInputMinSize;

				if(inputSizePixel < minSize){
					inputSizePixel = (inputListSize - paddingFix);
				}

				var inputSizePercent = ((inputSizePixel*100)/inputListSize);

				inputElement.css('width',inputSizePercent+'%');

				// console.log('lineSize: '+lineSize+' -- Inputsize: '+inputSizePercent)
			}

			var isStringEmpty = function(str){
				return (!str || 0 === str.length);
			}

			return newItemsList(config);
		}
		
	}

	window.lnil = lnItemsListApi;
}
)();