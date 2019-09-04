import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent implements OnInit {
  title = 'csv-to-table';
  // выводит сообщение об обработке или ошибке обработки файла
  message = '';
  // хранит названия столбцов
  columns: string[] = [];
  // данные для отображения
  data: Object[] = [];
  // источник данных для таблицы
  dataSource = new MatTableDataSource<Object>(this.data);
  // пагинация страниц
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  ngOnInit() {
    // добавляем к источнику данных пагинацию
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  // функция обработчик события изменения формы с выбором файла
  uploadListener(event: any): void {
    let files = event.target.files;
    // проверка типа файла
    if (
      files[0].name.endsWith('.csv')
      && ( files[0].type === 'text/csv'
      || files[0].type === 'application/vnd.ms-excel')
      ) {
      this.data = [];
      // создаем объект FileReader для получения содержимого файла
      let reader = new FileReader();
      reader.readAsText(files[0]);
      reader.onload = () => {
        // полученную информацию делим на строки
        let rows: string[] = (<string>reader.result).split('\n');
        // из первой строки получаем данные для заголовков столбцов 
        this.columns = rows[0].split(',');
        // из оставшихся строк получеам содержимое ячеек, собираем объект для строки таблицы и заносим его в data
        for (let i = 1; i < rows.length - 1; i++) {
          let row: string[] = rows[i].split(',');
          let obj = new Object();
          for (let j = 0; j < row.length; j++) {
            obj[this.columns[j]] = row[j];
          }
          this.data.push(obj);
        }
          this.dataSource.data = this.data;
          this.message = 'Файл успешно загружен';
      };
    } else {
      this.message = 'Похоже что это не csv файл';
    }
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
