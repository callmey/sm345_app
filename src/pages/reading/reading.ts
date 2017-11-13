import { Component, OnInit } from '@angular/core';
import { NavController, ActionSheetController, NavParams, AlertController, ToastController,App, ViewController } from 'ionic-angular';
import { HomePage } from '.././home/home';
import { WritePage } from '.././write/write';
//import { EditPage } from '.././edit/edit';
import { ServerService } from '../../app/server.service';
import { Article } from '../../models/article';


@Component({
  templateUrl: 'reading.html'
})
export class ReadingPage implements OnInit {
  private id;
  private board_id;
  serverService: ServerService;
  private article: Article;
  private currentUser;
  private USERID;
  private USERAUTH;
  private comment: Comment;

  toggleEdit: boolean = false;

  constructor(public viewCtrl: ViewController, public app: App, public toastCtrl: ToastController, public alertCtrl: AlertController, serverService: ServerService, public navParams: NavParams, public navCtrl: NavController, public actionSheetCtrl: ActionSheetController) {
    this.id = this.navParams.get("id");
    this.board_id = this.navParams.get("board_id");
    this.article = new Article(0,0,"","",0,0,0,"");
    this.serverService = serverService;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.USERID = this.currentUser.USERID;
    this.USERAUTH = this.currentUser.USERAUTH;
    //this.comment = new Comment(0,0,"",0);
  }

  ngOnInit() {
    this.serverService.getArticle(this.board_id, this.id).then(
      article => { this.article = article;
                  console.log(article.article_title);
      });
  }

  openHomePage() {
    this.navCtrl.setRoot(HomePage);
  }

  presentCommentSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '작업 선택',
      buttons: [{
            text: '수정',
            handler: () => {
            }
        },{
          text: '삭제',
          role: 'destructive',
          handler: () => {
          }
        },{
          text: '취소',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

  showDeleteAlert(article) {
    let confirm = this.alertCtrl.create({
      title: '이 글을 삭제하시겠습니까?',
      buttons: [
        {
          text: '취소',
          handler: () => {
            console.log('취소 clicked');
          }
        },
        {
          text: '삭제하기',
          handler: () => {
            this.serverService.deleteArticle(article.id, article.board_id);
          }
        }
      ]
    });
    confirm.present();
  }
/*
  WriteDelete(id) {

    this.serverService.removeArticle(id);
    this.Toast('');
    setTimeout(() => { 
      this.app.getRootNav().setRoot(RoomPage);
      }, 300);
      this.dismiss();
    this.navCtrl.pop();
  }
  */

  Toast(message) {
    let toast = this.toastCtrl.create({
    message: message,
    duration: 3000,
    position: 'bottom',
    });
    toast.present();
  }

  openWritePage(id) {
    //this.navCtrl.push(EditPage, { id: id });
  }
/*
  commentSubmit(id) {
    this.comment.article_id = id;
    this.comment.comment_writer = this.USERID;
    this.serverService.createComment(this.comment)
    this.presentToast('댓글이 등록되었습니다');

    setTimeout(() => { 
      this.app.getRootNav().setRoot(ReadingPage);
      }, 300);
      this.dismiss();
    //this.navCtrl.pop();
  }
  */

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message.title,
      duration: 3000,
      position: 'bottom',
    });
    toast.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  // 수정 토글
  handleToggleEdit() {
    this.toggleEdit = !this.toggleEdit;
  }

  // 수정 완료
  editArticle() {
      this.serverService.editArticle(this.article)
          .then(res => this.presentToast('수정되었습니다.'))
      
      let toast = this.toastCtrl.create({
          message: '수정 돠었습니다.',
          duration: 3000,
          position: 'bottom',
      });
      toast.present();

      this.toggleEdit = !this.toggleEdit
  }
}
