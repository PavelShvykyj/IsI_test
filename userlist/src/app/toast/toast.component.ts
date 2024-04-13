import { Component, OnInit, inject } from '@angular/core';
import { ToastService } from '../services/toast-service.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {

  servise = inject(ToastService)

  constructor() { }

  ngOnInit() {
  }

}
