import {createApp} from "https://unpkg.com/petite-vue@0.2.2/dist/petite-vue.es.js";

createApp({
    PouchDB: null,
    /*
        Datenbankverbindungen
    */
    // Lokal
    dbRezepte: null,
    dbMaterialien: null,
    dbProdukte: null,
    // Remote
    rDbRezepte: null,
    rDbMaterialien: null,
    rDbProdukte: null,
    /*
        Datensammlungen
        = Arrays mit den Daten aus der Datenbank
    */
    rezepte: [],
    materialien: [],
    produkte: [],
    // Schalter
    addProdukt: false,
    addSchrittProdukt: false,
    addMaterial: false,
    showRezepteList: false,
    /*
        Default Datenobjekte
     */
    rezept: () => {
        return {
            _id: "",
            name: "",
            anleitung: {
                schritte: [],
            },
        }
    },
    schritt: (nr = "") => {
        return {
            nr: nr,
            text: "",
            zeit: {
                dauer: "",
                typ: "",
            },
            materialien: [],
            produkte: [],
        }
    },
    produkt: () => {
        return {
            _id: "",
            qualitaet: 0,
            verpackung: 0,
            verfuegbarkeit: 0,
            saison: 0,
            herkunft: 0,
            kategorie: 0,
        }
    },
    schrittProdukt: () => {
        return {
            produktId: "",
            preis: 0,
            gewicht: 0
        }
    },
    material: () => {
        return {
            _id: "",
        }
    },
    //
    curRezept: {},
    rezeptExists: false,
    curSchritt: 1,
    curProdukt: null,
    // Formular Variablen
    fMaterial: "", // gewähltes Material
    fProdukt: "", // gewähltes Produkt
    fRezeptName: "", // Name des Rezepts
    asText: "", // Arbeitsschritt Text
    asDauer: 0, // Arbeitsschritt Dauer
    asTyp: "", // Arbeitsschritt Typ
    schrittChanged: {},
    saved: false,
    /*
        FUNKTIONEN
     */
    getProduktSelection(schritt) {
        console.log(schritt)
        if (this.curRezept.anleitung) {
            const included = this.curRezept.anleitung.schritte[schritt - 1].produkte.map(p => p.produktId)
            return this.produkte.filter(p => included.indexOf(p._id) === -1)
        } else {
            return []
        }
    },
    async schrittProduktHinzugefuegt(data) {
        this.curProdukt = null
        this.addSchrittProdukt = false
    },
    async produktHinzugefuegt(data) {
        console.log(data)
        this.addProdukt = false
        this.curProdukt = data.detail
        this.fProdukt = ""
        this.addSchrittProdukt = true
        // this.curRezept.anleitung.schritte[this.curSchritt - 1].produkte.push(data.detail);
        // await this.upsertRezept();
    },
    async materialHinzugefuegt(data) {
        console.log(data)
        this.addMaterial = false
        //this.curRezept.anleitung.schritte[this.curSchritt - 1].materialien.push(data.detail);
        // await this.upsertRezept();
    },
    /*
        Update der Datensammlungen:
        - Holt Daten aus der Datenbank
        - dbname = "Rezepte", "Materialien" oder "Produkte"
     */
    async update(dbName) {
        const result = await this["db" + dbName].allDocs({
            include_docs: true,
            attachments: true
        });
        this[dbName.toLowerCase()] = result.rows.filter(r => !r.doc._id.match(/^_design/)).map(r => r.doc);
        console.log(this[dbName.toLowerCase()]);
    },
    displayCount() {
    },
    save() {
    },
    setSchrittChanged(nr) {
        this.schrittChanged[nr] = true;
    },
    schrittUnchanged(nr) {
        return !this.schrittChanged[nr];
    },
    async addStep(save = true) {
        const neuerSchritt = this.schritt();
        console.log("neuer schritt", neuerSchritt)
        console.log("...", this.curRezept)
        neuerSchritt.nr = this.curRezept.anleitung.schritte.length + 1;
        this.curRezept.anleitung.schritte.push(neuerSchritt);
        if (save) {
            //await this.upsertRezept();
        }
    },
    exists() {
        return this.rezepte.findIndex(r => r.name === this.fRezeptName) > -1
        /*try {
            const response = await this.dbRezepte.find({ selector: { name: this.fRezeptName } });
            console.log(response)
            return response.docs.length > 0
        } catch (err) {
            if (err.name === "not_found") {
                return false
            } else {
                // hm, some other error
                console.error(err)
                throw err;
            }
        }*/
    },
    checkIfRezeptExists() {
        if (this.fRezeptName.length > 1) {
            this.rezeptExists = this.exists()
            console.log("rezeptExists: ", this.rezeptExists, this.fRezeptName)
        }
    },
    async loadRezept(id) {
        console.log(id)
        if (typeof id === "undefined") {
            this.curRezept = this.rezepte.find(r => r.name === this.fRezeptName)
        } else {
            if (id.detail) {
                this.curRezept = this.rezepte.find(r => r._id === id.detail)
            } else {
                this.curRezept = this.rezepte.find(r => r._id === id)
            }
            this.fRezeptName = this.curRezept.name
        }
        this.rezeptExists = false
    },
    async saveRezept() {
        this.curRezept.name = this.fRezeptName
        if (this.curRezept._id) {
            const curRezept = await this.dbRezepte.get(this.curRezept._id)
            this.curRezept._rev = curRezept._rev
            const response = await this.dbRezepte.put(this.curRezept)
            console.log("Rezept aktualisiert", response)
        } else {
            try {
                const response = await this.dbRezepte.post(this.curRezept)
                console.log("Neues Rezept gespeichert", response)
                this.curRezept._id = response.id
            } catch (err) {
                console.error(err)
            }
        }
    },
    async onProduktChange(event, schrittNr) {
        if (event.target.value === "0") {
            console.log("Produkt hinzufügen")
            this.addProdukt = true
        } else {
            this.curProdukt = this.produkte.find((p) => p._id === event.target.value)
            this.addSchrittProdukt = true
            this.fProdukt = ""
        }
    },
    async onMaterialChange(event, schrittNr) {
        if (event.target.value === "0") {
            console.log("Material hinzufügen")
            this.addMaterial = true
        } else {
            let p = Object.assign({}, this.material);
            p = this.materialien.find((m) => m._id === event.target.value);
            this.curRezept.anleitung.schritte[this.curSchritt - 1].materialien.push(p);
            //await this.upsertRezept()
            event.target.value = ""
        }
    },
    async saveAttachments(data) {
        for (const file of data.detail) {
            if (file) {
                const response = await this.dbRezepte.putAttachment(this.curRezept._id, file.name, this.curRezept._rev, file, file.type)
                console.log(response)
            }
        }
    },
    /*
        Komponenten
     */
    fotoFormKomponente(props) {
        return {
            PouchDB: props.pdb,
            self: props.self,
            dbMaterialien: null,
            dateien: [],
            $template: "#foto-form-template",
            processFotos() {
                const input = document.getElementById('fotosToProcess');
                this.$refs.fotoUploadForm.dispatchEvent(
                    new CustomEvent('save', {bubbles: true, detail: input.files})
                )
            },
            fotoAbbrechen() {

            },

            edit(id) {
                const curMaterial = this.materialien.find(m => m._id === id)
                console.log(curMaterial)
                this.name = curMaterial._id

            },

            async init() {
                //this.dbMaterialien = new PouchDB("Materialien");
                //await this.updateMaterialien();
                console.log("Komponente mounted", this.dateien);
            },
        };
    },
    fotoListKomponente(props) {
        return {
            self: props.self,
            rezept: props.rezept,
            bilder: [],
            $template: "#foto-list-template",
            init() {
                const bilder = []
                if (Object.keys(this.rezept._attachments).length) {
                    for (const name of Object.keys(this.rezept._attachments)) {
                        console.log(this.rezept._attachments[name])
                        bilder.push({
                            name: name,
                            url: 'data:' + this.rezept._attachments[name].content_type + ';base64,' + this.rezept._attachments[name].data
                        })
                    }
                    this.bilder = bilder
                }
                console.log("Foto Liste Komponente mounted", bilder);
            },
        };
    },
    rezeptListKomponente(props) {
        return {
            rezepte: props.rezepte,
            $template: "#rezept-list-template",
            edit(id) {
                this.$refs.rezeptList.dispatchEvent(
                    new CustomEvent('edit', {bubbles: true, detail: id})
                )
                this.close()
            },
            close() {
                this.$refs.rezeptList.dispatchEvent(
                    new CustomEvent('close', {bubbles: true, detail: null})
                )
            },
            async init() {
                console.log("Rezept List Komponente mounted");
            },
        };
    },
    schrittProduktFormKomponente(props) {
        return {
            PouchDB: props.pdb,
            self: props.self,
            dbProdukte: null,
            schrittProdukt: {
                produktId: props.produkt._id,
                preis: 0,
                gewicht: 0
            },
            schritt: props.schritt,
            $template: "#schritt-produkt-form-template",
            edit(id) {
            },
            async insertSchrittProdukt() {
                // Prüfen ob Preis und Gewicht angegeben wurden
                console.log("schrittProdukt hinzufügen", this.schrittProdukt)
                props.rezept.anleitung.schritte[props.schritt - 1].produkte.push(this.schrittProdukt)
                this.$refs.schrittProduktform.dispatchEvent(
                    new CustomEvent('finished', {bubbles: true, detail: null})
                )
            },
            schrittProduktAbbrechen() {
                this.$refs.schrittProduktform.dispatchEvent(
                    new CustomEvent('canceled', {bubbles: true, detail: null})
                )
            },
            async init() {
                console.log("Komponente mounted");
            },
        };
    },
    produktFormKomponente(props) {
        return {
            PouchDB: props.pdb,
            self: props.self,
            dbProdukte: null,
            name: props.name,
            produkte: [],
            $template: "#produkt-form-template",
            edit(id) {
                const curProdukt = this.produkte.find(p => p._id === id)
                console.log(curProdukt)
                this.name = curProdukt._id
            },
            async updateProdukte() {
                const result = await this.dbProdukte.allDocs({
                    include_docs: true,
                });
                console.log("Produkte:", result);
                this.produkte = result.rows.map(r => r.doc);
            },
            async insertProdukt() {
                let produkt = {
                    _id: this.name,
                    date: new Date().toISOString(),
                };
                console.log("neues Produkt", produkt)
                try {
                    const response = await this.dbProdukte.put(produkt);
                    console.log("Eintrag gespeichert", response);
                    await this.updateProdukte();
                    // toDo: emit event from component as demonstrated here: https://jsfiddle.net/nooooooom/fsk7bm6j/7/
                    // => goal: after the product was inserted, include it in the rezept and close the product add form
                    this.$refs.produktform.dispatchEvent(
                        new CustomEvent('finished', {bubbles: true, detail: produkt})
                    )
                } catch (err) {
                    console.log(err);
                }
            },
            produktAbbrechen() {
                this.$refs.produktform.dispatchEvent(
                    new CustomEvent('canceled', {bubbles: true, detail: null})
                )

            },
            async upsertProdukt() {
                let produkt;
                try {
                    produkt = await this.dbProdukte.get(this.name);
                } catch (err) {
                    if (err.name === "not_found") {
                        // falls der Eintrag dort nicht existiert
                        produkt = {
                            // gib einen neuen Eintrag zurück, der dann in die DB geschrieben werden kann
                            _id: this.name,
                            date: new Date().toISOString(),
                        };
                    } else {
                        // hm, some other error
                        throw err;
                    }
                }
                try {
                    const response = await this.dbProdukte.put(produkt);
                    console.log("Eintrag gespeichert", response);
                    await this.updateProdukte();
                } catch (err) {
                    console.log(err);
                }
            },
            async init() {
                this.dbProdukte = new PouchDB("Produkte");
                await this.updateProdukte();
                console.log("Komponente mounted", this.produkte);
            },
        };
    },
    materialFormKomponente(props) {
        return {
            PouchDB: props.pdb,
            self: props.self,
            dbMaterialien: null,
            name: props.name,
            materialien: [],
            $template: "#material-form-template",
            edit(id) {
                const curMaterial = this.materialien.find(m => m._id === id)
                console.log(curMaterial)
                this.name = curMaterial._id

            },
            async updateMaterialien() {
                const result = await this.dbMaterialien.allDocs({
                    include_docs: true,
                });
                console.log("Materialien:", result);
                this.materialien = result.rows.map(r => r.doc);
            },
            async insertMaterial() {
                let material = {
                    _id: this.name,
                    date: new Date().toISOString(),
                };
                try {
                    const response = await this.dbMaterialien.put(material);
                    console.log("Eintrag gespeichert", response);
                    await this.updateMaterialien();
                    // toDo: emit event from component as demonstrated here: https://jsfiddle.net/nooooooom/fsk7bm6j/7/
                    // => goal: after the product was inserted, include it in the rezept and close the product add form
                    this.$refs.materialform.dispatchEvent(
                        new CustomEvent('finished', {bubbles: true, detail: material})
                    )
                } catch (err) {
                    console.log(err);
                }
            },
            async upsertMaterial() {
                let material;
                try {
                    material = await this.dbMaterialien.get(this.name);
                } catch (err) {
                    if (err.name === "not_found") {
                        // falls der Eintrag dort nicht existiert
                        material = {
                            // gib einen neuen Eintrag zurück, der dann in die DB geschrieben werden kann
                            _id: this.name,
                            date: new Date().toISOString(),

                        };
                    } else {
                        // hm, some other error
                        throw err;
                    }
                }
                try {

                    const response = await this.dbMaterialien.put(material);
                    console.log("Eintrag gespeichert", response);
                    await this.updateMaterialien();
                } catch (err) {
                    console.log(err);
                }
            },
            materialAbbrechen() {

                this.$refs.materialform.dispatchEvent(
                    new CustomEvent('canceled', {bubbles: true, detail: null})
                )

            },
            async init() {
                this.dbMaterialien = new PouchDB("Materialien");
                await this.updateMaterialien();
                console.log("Komponente mounted", this.materialien);
            },
        };
    },
    /*
        Startfunktion
        - wird ausgeführt, sobald die Seite geladen wurde
     */
    async onMounted() {
        console.log("onMounted startet...");
        this.dbRezepte = new PouchDB("Rezepte"); // Greift auf die Datenbank zu, bzw erzeugt sie wenn nicht vorhanden
        this.rDbRezepte = new PouchDB("https://apartofnature.info/rezepte", {
            auth: {
                username: "rezeptator",
                password: "IkolpingT2023"
            }
        })
        this.dbRezepte.sync(this.rDbRezepte, {
            live: true,
            retry: true
        }).on('error', function (err) {
            console.log("Rezepte Sync Error")
        });
        await this.update("Rezepte"); // Der string Rezepte wird der update funktion übergeben
        //
        this.dbMaterialien = new PouchDB("Materialien");
        this.rDbMaterialien = new PouchDB("https://apartofnature.info/materialien", {
            auth: {
                username: "rezeptator",
                password: "IkolpingT2023"
            }
        })
        this.dbMaterialien.sync(this.rDbMaterialien, {
            live: true,
            retry: true
        }).on('error', function (err) {
            console.log("Materialien Sync Error")
        });
        await this.update("Materialien");
        //
        this.dbProdukte = new PouchDB("Produkte")
        this.rDbProdukte = new PouchDB("https://apartofnature.info/produkte", {
            auth: {
                username: "rezeptator",
                password: "IkolpingT2023"
            }
        })
        this.dbProdukte.sync(this.rDbProdukte, {
            live: true,
            retry: true
        }).on('error', function (err) {
            console.log("Produkte Sync Error")
        });
        await this.update("Produkte")
        //
        console.log("Datenbanken und -sammlungen initialisiert...");
        //
        this.curRezept = this.rezept()
        this.curRezept.anleitung.schritte.push(this.schritt(1))
        console.log("Neues Rezept initialisiert...");
    },

}).mount("#Rezeptformular");
