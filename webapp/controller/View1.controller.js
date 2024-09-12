sap.ui.define([
  "sap/ui/core/mvc/Controller", "sap/ui/core/Fragment", "sap/m/MessageToast", "sap/ui/model/Filter"
],
  function (Controller, Fragment, MessageToast, Filter) {
    "use strict";
    return Controller.extend("task.thirumal.controller.View1", {
      onInit: function () {
        this.fModel = this.getOwnerComponent().getModel()
        this.fModel.setDeferredGroups(this.fModel.getDeferredGroups().concat(
          "createChanges"
        ))
      },
      addBtn() {
        var newData = this.fModel.createEntry("/CRGendata", { groupId: "createChanges" })
        Fragment.load({
          id: this.getView().getId(),
          name: "task.thirumal.fragments.add",
          controller: this
        }).then((f) => {
          this.getView().addDependent(f)
          f.setBindingContext(newData)
          f.open()

        })
      },
      onAdd(evn) {
        this.fModel.submitChanges({
          success: () => {
            MessageToast.show("data added")
            evn.getSource().getParent().getParent().close()
          },
          error: (err) => {
            MessageToast.show(err)
          }
        })
      },
      cancel(evn) {
        evn.getSource().getParent().getParent().close()
        this.fModel.resetChanges()
      },
      page2(evn) {
        this.getOwnerComponent().getRouter().navTo("RouteView2", {
          path: window.encodeURIComponent(evn.getSource().getBindingContext().getPath())

        })
      },
      onDelete() {
        var sTable = this.byId("smartTable")
        var gTable = sTable.getTable()
        var indices = gTable.getSelectedItems()
        indices.forEach(item => {
          var spath = item.getBindingContext().getPath()
          this.fModel.remove(spath, {
            success: () => {
              MessageToast.show("deleted")
            },
            error: (err) => {
              MessageToast.show(err)
            }
          })
        });
      },
      search(evn) {
        var query = evn.getParameter("query")
        var afilter = new Filter({
          filters: [
            new Filter("SiteCode", "Contains", query),
            new Filter("SiteName", "Contains", query),
            new Filter("CRCode", "Contains", query),
            new Filter("CRName", "Contains", query),
            new Filter("Specialities", "Contains", query),
            new Filter("CVAvailable", "Contains", query),
            new Filter("Status", "Contains", query)
          ]
        })
        var sTable = this.byId("smartTable")
        var gTable = sTable.getTable()
        var binding = gTable.getBinding("items")
        binding.filter(afilter)
      }




    });
  });
