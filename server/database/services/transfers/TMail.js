class TMail{
    id;
    mail_to;
    type;
    mail_name;
    mail_from;
    subject;
    html;
    _to;
    usuario;
    createdAt;
    updatedAt;
    constructor(id, mail_to, type, mail_name, mail_from, subject, html, _to, usuario, createdAt, updatedAt){
        this.id = id;
        this.mail_to = mail_to;
        this.type = type;
        this.mail_name = mail_name;
        this.mail_from = mail_from;
        this.subject = subject;
        this.html = html;
        this._to = _to;
        this.usuario = usuario;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    getId(){
        return this.id;
    }
    setId(id_mail){
        this.id = id_mail;
    }
    getMail_to(){
        return this.mail_to;
    }
    setMail_to(mail_to_mail){
        this.mail_to = mail_to_mail;
    }
    getType(){
        return this.type;
    }
    setType(type_mail){
        this.type = type_mail;
    }
    getMailName(){
        return this.mail_name;
    }
    setMailName(mail_name){
        this.mail_name = mail_name;
    }
    getMailFrom(){
        return this.mail_from;
    }
    setMailFrom(mail_from){
        this.mail_from = mail_from;
    }
    getSubject(){
        return this.subject;
    }
    setSubject(subject_mail){
        this.subject = subject_mail;
    }
    getHtml(){
        return this.html;
    }
    setHtml(html_mail){
        this.html = html_mail;
    }
    getTo(){
        return this._to;
    }
    setTo(to_mail){
        this._to = to_mail;
    }
    getUsuario(){
        return this.usuario;
    }
    setUsuario(usuario_mail){
        this.usuario = usuario_mail;
    }
    getCreatedAt(){
        return this.createdAt;
    }
    setCreatedAt(createdat_upload){
        this.createdAt = createdat_upload;
    }
    getUpdatedAt(){
        return this.updatedAt;
    }
    setUpdatedAt(updatedat_upload){
        this.updatedAt = updatedat_upload;
    }


}
module.exports = TMail;