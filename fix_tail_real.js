const fs = require('fs');

let c = fs.readFileSync('src/components/CreateScent.tsx', 'utf8');
const idx = c.lastIndexOf('<div className="form-group">');
if(idx !== -1){
    const newTail = `<div className="form-group">
                                <label data-i18n="formName">Ad Soyad</label>
                                <input type="text" id="order-name" placeholder="Adınız Soyadınız" data-i18n="formNamePl" required/>
                            </div>
                            <div className="form-group">
                                <label data-i18n="formPhone">Telefon</label>
                                <input type="tel" id="order-phone" placeholder="05XX XXX XX XX" data-i18n="formPhonePl" required/>
                            </div>
                            <div className="form-group">
                                <label data-i18n="formAddr">Teslimat Adresi</label>
                                <textarea id="order-address" rows={3} placeholder="Açık adresinizi giriniz..." data-i18n="formAddrPl" required></textarea>
                            </div>
                        </div>

                        <div className="wizard-actions">
                            <button className="btn btn-outline" onClick={() => { /* TODO: handle nextWizardStep(4) */ }} data-i18n="btnBack">Geri</button>
                            <button className="btn btn-primary" onClick={() => { /* TODO: handle submitOrder() */ }} data-i18n="btnSubmit">Siparişi Onayla</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
  );
}`;
    c = c.substring(0, idx) + newTail;
    fs.writeFileSync('src/components/CreateScent.tsx', c);
    console.log("Fixed tail.");
}
