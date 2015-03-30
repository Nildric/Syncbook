/*
 * File: app/controller/EventActionController.js
 *
 * This file was generated by Sencha Architect version 3.0.4.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.2.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('syncbook.controller.EventActionController', {
    extend: 'Ext.app.Controller',

    refs: [
        {
            ref: 'InitialViewArea',
            selector: 'InitialViewArea_ua'
        },
        {
            ref: 'AddEventWindow',
            selector: 'AddEventWindow_ua'
        },
        {
            ref: 'ModEventWindow',
            selector: 'ModEventWindow_ua'
        }
    ],

    addEventButtonClick: function(button, e, eOpts) {
        /*Toolbar Add Event Button*/

        // Creazione di una finestra di aggiunta Evento
        var addEventWindow = Ext.create("syncbook.view.AddEventWindow");

        // Creazione CurrentDate
        var currentDate = Ext.util.Format.date(new Date(), 'Y-m-d');
        currentDate = currentDate+"T00:00:00+00:00";

        var varUUID = Ext.create("syncbook.model.UuidGenerator").data.UUID;
        // Creazione di un Evento ausiliario secondo il modello scelto per caricare il Form della finestra di aggiunta del'evento
        var auxiliarNewEvent = Ext.create("syncbook.model.EventInformationModel", {
            eventName: "",
            eventStart: currentDate,
            eventStartTime: "",
            eventEnd: currentDate,
            eventEndTime: "",
            eventDescription: "",
            eventType: "",
            eventLocation: "",
            eventUrl: "",
            UUID: varUUID
        });
        // Carico il Record all'interno della finestra per l'aggiunta dell'evento
        this.getAddEventWindow().getComponent('addEventForm').loadRecord(auxiliarNewEvent);
        // Mostro la finestra al Client
        addEventWindow.show();
    },

    addEventSubmitClick: function(button, e, eOpts) {
        /*Submit Button in Add Event Window*/

        // Raggiungo il Form.
        var auxiliarForm = this.getAddEventWindow().getComponent('addEventForm').getForm();
        // Estraggo il Record dal Form.
        formRecord = auxiliarForm.getRecord();
        // Aggiorno il Form con il Record appena prelevato.
        auxiliarForm.updateRecord(formRecord);
        // Visualizzo Errori, se presenti.
        auxiliarForm.clearInvalid();

        var customValidationOK = auxiliarForm.isValid();
        var formValidationOK = true;
        var canSave = true;

        if(formRecord.data.eventStart.getTime()>formRecord.data.eventEnd.getTime())
        {
            auxiliarForm.markInvalid({'eventStart':'Event Start must be lower than Event End'});
            auxiliarForm.markInvalid({'eventEnd':'Event End must be higher than Event Start'});
            customValidationOK = false;
        } else {
            if(formRecord.data.eventStart.getTime()==formRecord.data.eventEnd.getTime() && formRecord.data.eventStartTime.getTime()>formRecord.data.eventEndTime.getTime())
            {
                auxiliarForm.markInvalid({'eventStartTime':'Event Start Time must be lower than Event End Time'});
                auxiliarForm.markInvalid({'eventEndTime':'Event End Time must be higher than Event Start Time'});
                customValidationOK = false;
            }
        }

        canSave = (customValidationOK && formValidationOK);

        // Verifico la Validità del Form
        if(canSave === true) {
            // Chiudo la finestra di Aggiunta di un Evento
            this.getAddEventWindow().close();
            // Confermo che il Record preso dal Form è stato utilizzato
            formRecord.setDirty();
            // Chiamo la funzione ausiliaria per l'aggiunta di un vCalendar all'interno di un Database
            this.addingEventFunction(formRecord);
        } else {
            Ext.Msg.show({
                title: "Form Error",
                msg: "Uncorrect Form Compilation",
                buttons: Ext.Msg.OK,
                closable: false,
                scope: this,
                icon: Ext.window.MessageBox.ERROR
            });
        }
    },

    modEventButtonClick: function(button, e, eOpts) {
        /*Toolbar Mod Event Button*/

        // Creo una referenza alla ChooseEventGrid
        var eventGrid = this.getInitialViewArea().getComponent('calendarPanel').getComponent('chooseEventGrid');
        // Estraggo il Record selezionato nella griglia appena referenziata
        eventGridSelected = eventGrid.getSelectionModel().getSelection();

        if(eventGridSelected.length>0) {
            // Creazione di una finestra di modifica Evento
            var modEventWindow = Ext.create("syncbook.view.ModEventWindow");
            // Carico il Record all'interno della finestra per la modifica dell'evento
            eventGridSelected[0].data.eventStartTime = eventGridSelected[0].data.eventStart;
            eventGridSelected[0].data.eventEndTime = eventGridSelected[0].data.eventEnd;
            this.getModEventWindow().getComponent('modEventForm').loadRecord(eventGridSelected[0]);
            // Mostro la finestra al Client
            modEventWindow.show();
        } else {
            Ext.Msg.show({
                title: "No Item Selection",
                msg: "Select an Item in the Grid to Proceed with your Action",
                buttons: Ext.Msg.OK,
                closable: false,
                scope: this,
                icon: Ext.window.MessageBox.ERROR
            });
        }
    },

    modEventSubmitClick: function(button, e, eOpts) {
        /*Submit Button in Mod Event Window*/

        // Raggiungo il Form.
        var auxiliarForm = this.getModEventWindow().getComponent('modEventForm').getForm();
        // Estraggo il Record dal Form.
        formRecord = auxiliarForm.getRecord();
        // Aggiorno il Form con il Record appena prelevato.
        auxiliarForm.updateRecord(formRecord);
        // Visualizzo Errori, se presenti.
        auxiliarForm.clearInvalid();

        var customValidationOK = auxiliarForm.isValid();
        var formValidationOK = true;
        var canSave = true;
        if(formRecord.data.eventStart.getTime()>formRecord.data.eventEnd.getTime())
        {
            auxiliarForm.markInvalid({'eventStart':'Event Start must be lower than Event End'});
            auxiliarForm.markInvalid({'eventEnd':'Event End must be higher than Event Start'});
            customValidationOK = false;
        } else {
            if(formRecord.data.eventStartTime.getTime()>formRecord.data.eventEndTime.getTime() && formRecord.data.eventStart.getTime()==formRecord.data.eventEnd.getTime())
            {
                auxiliarForm.markInvalid({'eventStartTime':'Event Start Time must be lower than Event End Time'});
                auxiliarForm.markInvalid({'eventEndTime':'Event End Time must be higher than Event Start Time'});
                customValidationOK = false;
            }
        }

        canSave = (customValidationOK && formValidationOK);

        // Verifico la Validità del Form
        if(canSave === true) {
            // Chiudo la finestra di Modifica di un Evento
            this.getModEventWindow().close();
            // Confermo che il Record preso dal Form è stato utilizzato
            formRecord.setDirty();

            formRecord.data.eventStart.setHours(formRecord.data.eventStartTime.getHours());
            formRecord.data.eventStart.setMinutes(formRecord.data.eventStartTime.getMinutes());
            formRecord.data.eventStart.setSeconds(formRecord.data.eventStartTime.getSeconds());
            formRecord.data.eventEnd.setHours(formRecord.data.eventEndTime.getHours());
            formRecord.data.eventEnd.setMinutes(formRecord.data.eventEndTime.getMinutes());
            formRecord.data.eventEnd.setSeconds(formRecord.data.eventEndTime.getSeconds());

            this.moddingEventFunction(formRecord);

            var eventForm = this.getInitialViewArea().getComponent('calendarPanel').getComponent('singleEventForm');
            eventForm.getForm().loadRecord(formRecord);

            if(formRecord.data.eventName!=="") {eventForm.setTitle("Event : "+formRecord.data.eventName);}
        } else {
            Ext.Msg.show({
                title: "Form Error",
                msg: "Uncorrect Form Compilation",
                buttons: Ext.Msg.OK,
                closable: false,
                scope: this,
                icon: Ext.window.MessageBox.ERROR
            });
        }
    },

    deleteEventSubmitClick: function(button, e, eOpts) {
        /*Toolbar Delete Event Button*/

        // Creo una referenza alla ChooseEventGrid
        var eventGrid = this.getInitialViewArea().getComponent('calendarPanel').getComponent('chooseEventGrid');
        // Estraggo il Record selezionato nella griglia appena referenziata
        eventGridSelected = eventGrid.getSelectionModel().getSelection();

        if(eventGridSelected.length>0) {
            Ext.Msg.show({
                title: "Deleting Operation",
                msg: "Are You Sure to Delete the event : "+eventGridSelected[0].data.eventName+" ?",
                buttons: Ext.Msg.YESNO,
                closable: false,
                scope: this,
                fn: function(btn) {
                    if(btn === 'yes') {
                        this.deletingEventFunction(eventGridSelected[0]);
                        this.getInitialViewArea().getComponent('calendarPanel').getComponent('singleEventForm').getForm().reset();
                        this.getInitialViewArea().getComponent('calendarPanel').getComponent('singleEventForm').setTitle("Event Information");
                    }
                },
                icon: Ext.window.MessageBox.QUESTION
            });
        } else {
            Ext.Msg.show({
                title: "No Item Selection",
                msg: "Select an Item in the Grid to Proceed with your Action",
                buttons: Ext.Msg.OK,
                closable: false,
                scope: this,
                icon: Ext.window.MessageBox.ERROR
            });
        }
    },

    syncEventButtonClick: function(button, e, eOpts) {
        this.syncEventsFunction();
    },

    addingEventFunction: function(storeRecord) {
        var mySelf = this;

        storeRecord.save({
            callback : function(records, operation, success) {
                var operationResult = Ext.decode(operation.response.responseText);

                if(operationResult.events.errorSuccess === false) {
                    console.error("An error with code : "+operationResult.events.errorCode+" has occoured = "+operationResult.events.errorDescription);
                } else {
                    mySelf.getInitialViewArea().getComponent('calendarPanel').getComponent('chooseEventGrid').store.load();
                }
            }
        });
    },

    moddingEventFunction: function(storeRecord) {
        var mySelf= this;

        storeRecord.save({
            callback : function(records, operation, success) {
                var operationResult = Ext.decode(operation.response.responseText);

                if(operationResult.events.errorSuccess === false) {
                    console.error("An error with code : "+operationResult.events.errorCode+" has occoured = "+operationResult.events.errorDescription);
                } else {
                    mySelf.getInitialViewArea().getComponent('calendarPanel').getComponent('chooseEventGrid').store.load();
                }
            }
        });
    },

    deletingEventFunction: function(storeRecord) {
        var mySelf= this;

        storeRecord.destroy({
            callback : function(records, operation, success) {
                var operationResult = Ext.decode(operation.response.responseText);

                if(operationResult.events.errorSuccess === false) {
                    console.error("An error with code : "+operationResult.events.errorCode+" has occoured = "+operationResult.events.errorDescription);
                } else {
                    mySelf.getInitialViewArea().getComponent('calendarPanel').getComponent('chooseEventGrid').store.load();
                }
            }
        });
    },

    syncEventsFunction: function() {
        var mySelf = this;

        Ext.Ajax.request({
            url: "resources/libraries/syncbookServices/syncService.php",
            params: {
                syncEvents : "syncEvents"
            },

            success: function(response) {
                var operationResult = Ext.decode(response.responseText);
                if(operationResult.events.errorSuccess === false) {
                    console.error("An error with code : "+operationResult.events.errorCode+" has occoured = "+operationResult.events.errorDescription);
                } else {
                    mySelf.getInitialViewArea().getComponent('calendarPanel').getComponent('chooseEventGrid').store.load();
                }
            },

            failure: function(response) {
                Ext.Msg.show({
                    title: "Response Error",
                    msg: "Response Error Message",
                    buttons: Ext.Msg.OK,
                    closable: false,
                    scope: this,
                    icon: Ext.window.MessageBox.ERROR
                });
            }
        });
    },

    init: function(application) {
        this.control({
            "#addEventButton": {
                click: this.addEventButtonClick
            },
            "#addEventSubmit": {
                click: this.addEventSubmitClick
            },
            "#modEventButton": {
                click: this.modEventButtonClick
            },
            "#modEventSubmit": {
                click: this.modEventSubmitClick
            },
            "#deleteEventButton": {
                click: this.deleteEventSubmitClick
            },
            "#syncEventButton": {
                click: this.syncEventButtonClick
            }
        });
    }

});
