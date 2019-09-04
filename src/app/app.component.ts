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
  dataSource: MatTableDataSource<Object>;
  // пагинация страниц
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  ngOnInit() {
    // добавляем к источнику данных пагинацию

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

        let objPattern = new RegExp(
          (
              // разделители строки и полей
              '(\\,|\\r?\\n|\\r|^)' +
              // поля в экранированных кавычках
              '(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|' +
              // стандартные разделители полей и строк
              '([^\"\\,\\r\\n]*))'
          ),
          'gi'
          );
        let arrMatches;
        // первая строка csv-файла - названия столбцов. пока isColumnsNameDone мы дсобираем назавния столбцов
        let isColumnsNameDone = false;
        let obj: Object;
        let currentColum = 0;
        this.columns = [];
        while (arrMatches = objPattern.exec(<string>reader.result)) {
          currentColum += 1;
          let strMatchedDelimiter = arrMatches[ 1 ];
          if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== ','
            ) {
              if (isColumnsNameDone) {
                this.data.push(obj);
              }
              isColumnsNameDone = true;
              currentColum = 0;
              obj = new Object();
          }
          let strMatchedValue;
          if (arrMatches[ 2 ]) {
            strMatchedValue = arrMatches[ 2 ].replace(
                    new RegExp( '\"\"', 'g' ),
                    '\"'
                    );
            } else {
                strMatchedValue = arrMatches[ 3 ];
            }


            if (isColumnsNameDone === false) {
              this.columns.push(strMatchedValue);
            } else {
                obj[this.columns[currentColum]] = strMatchedValue;
              }

        }
        this.dataSource = new MatTableDataSource<Object>(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      };
    }
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
