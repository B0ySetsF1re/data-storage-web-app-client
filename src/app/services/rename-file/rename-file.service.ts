import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RenameFileService {
  private baseUrl = 'http://localhost:3000/api/data-storage/rename-uploaded-file/';

  constructor(private httpClient: HttpClient) { }

  renameFile(id: string, body: any) {
    return this.httpClient.post<any>(`${this.baseUrl}${id}`, body);
  }
}