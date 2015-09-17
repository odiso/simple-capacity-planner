var Element = {

    /* List of all elements loaded */
    elementList : [],

    /* Return Element properties from its component */
    getElement : function (id)
    {
        return Element.elementList[Element.getElementKey(id)];
    },

    /* return the element position within the element list via its id */
    getElementKey : function(element_id)
    {
        for(var i in Element.elementList)
        {
            if(Element.elementList[i].id == element_id)
                return i;
        }
        return false;
    },

    /* return the element position within the parent component via its id */
    getElementKeyWithinComponent : function(element_id, component_id)
    {
        var component = Component.getComponent(component_id);

        for(var i in component.elements)
        {
            if(component.elements[i].id == element_id)
                return i;
        }
        return false;
    },

    /* Delete Element from database */
    remove : function(id,name)
    {
        var modalBox = $('#deleteElementModal');
        modalBox.find('p').html(l.get('delete_element_confirmation', name));
        modalBox.find('.deleteButton').unbind('click').click(function(){
            webservice.call('deleteElement', {id : id}, function(){

                // remove from local cache
                for(var i in Component.componentList)
                {
                    var component = Component.componentList[i];
                    for(var j in component.elements)
                    {
                        if(component.elements[j].id == id)
                        {
                            Component.componentList[i].elements.splice(j, 1);
                            break;
                        }

                    }
                }

                // remove from display
                UI.dataTable.removeElement(id);
                modalBox.foundation('reveal', 'close');
            });
        });
        modalBox.find('.cancelButton').unbind('click').click(function(){
            modalBox.foundation('reveal', 'close');
        });

        modalBox.foundation('reveal', 'open');
    },


    /* Edit Element properties from its component */
    edit : function(id, component_id){

        var element = Element.getElement(id);

        $('#edit_element_id').val(element.id);
        $('#edit_element_component_id').val(element.component_id);
        $('#edit_element_name').val(element.name);
        $('#edit_element_key').val(element.referenceKey);
        $('#edit_element_value').val(element.referenceValue);

        var modalBox = $('#editElementModal');
        modalBox.foundation('reveal', 'open');

        $('#edit_element').foundation({bindings:'events'}).off('valid.fndtn.abide').on('valid.fndtn.abide', function () {
            webservice.call('updateElement', $(this).serialize(), function(){

                /* edit element in elementList */

                var elementListKey = Element.getElementKey(id);
                Element.elementList[elementListKey].name = $('#edit_element_name').val();
                Element.elementList[elementListKey].referenceKey = $('#edit_element_key').val();
                Element.elementList[elementListKey].referenceValue = $('#edit_element_value').val();

                /* edit element in parent component */
                var componentKey = Component.getComponentKey(component_id);
                var elementKey = Element.getElementKeyWithinComponent(id, component_id);
                Component.componentList[componentKey].elements[elementKey].name = $('#edit_element_name').val();
                Component.redrawComponent(component_id);

                modalBox.foundation('reveal', 'close');
            });
        });
    },


    /* Create Element */
    create : function(component_id){

        $('#edit_element_id').val('');
        $('#edit_element_component_id').val(component_id);
        $('#edit_element_name').val('');
        $('#edit_element_key').val('');
        $('#edit_element_value').val('');

        var modalBox = $('#editElementModal');
        modalBox.foundation('reveal', 'open');

        $('#edit_element').foundation({bindings:'events'}).off('valid.fndtn.abide').on('valid.fndtn.abide', function () {
            webservice.call('createElement', $(this).serialize(), function(data){

                /* add element to elementList */
                Element.elementList.push({
                    id : data.id,
                    name : $('#edit_element_name').val(),
                    referenceKey : $('#edit_element_key').val(),
                    referenceValue : $('#edit_element_value').val(),
                    component_id : component_id
                });

                var componentKey = Component.getComponentKey(component_id);

                /* add element to parent component */
                Component.componentList[componentKey].elements.push({
                    id : data.id,
                    name : $('#edit_element_name').val()
                });
                Component.redrawComponent(component_id);

                modalBox.foundation('reveal', 'close');
            });
        });
    }
};
