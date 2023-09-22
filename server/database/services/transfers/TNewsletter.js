class TNewsletter{
    id;
    mail_to;
    createdAt;
    updatedAt;
    constructor(id, mail_to, createdAt, updatedAt){
        this.id = id;
        this.mail_to = mail_to;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    getId(){
        return this.id;
    }
    setId(id_news){
        this.id = id_news;
    }
    getMail_to(){
        return this.mail_to;
    }
    setMail_to(mail_tonews){
        this.mail_to = mail_tonews;
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
module.exports = TNewsletter;