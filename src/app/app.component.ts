import { Component } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'column-mapping';
  file: File;
  data: any;
  headers: string[] = ['Name', 'Age', 'MSISD', 'Location', 'Phone' ];
  newData: any;
  dataSource = [];
  
  uploadFile(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});

      const dataString = JSON.stringify(jsonData);
      // document.getElementById('output').innerHTML = dataString.slice(0, 300).concat("...");
      
      /* grab first sheet */
      const wsname: string = workBook.SheetNames[0];
      const ws: XLSX.WorkSheet = workBook.Sheets[wsname];

      /* save data */
      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
      let bool: boolean;
      bool = this.areHeadersEqual(this.data[0], this.headers);
      if (bool) {
        console.log(this.data.slice(1));
        this.dataSource = jsonData.Sheet1;
      }
      console.log(dataString, workBook)
    }
    reader.readAsBinaryString(file);
  }

 
  areHeadersEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (var i = arr1.length; i--;) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;

  }
}
