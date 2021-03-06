import { Component, OnInit, Directive, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, NgForm } from '@angular/forms';

import { UploadFileService } from '../../services/upload-file/upload-file.service';
import { GetFilesMetadataService } from '../../services/get-files-metadata/get-files-metadata.service';
import { DeleteFileService } from '../../services/delete-file/delete-file.service';
import { RenameFileService } from '../../services/rename-file/rename-file.service';
import { FileMetaData } from './file-metadata';

@Component({
  selector: 'app-files-metadata',
  templateUrl: './files-metadata.component.html',
  styleUrls: ['./files-metadata.component.css'],
  providers: [GetFilesMetadataService]
})
export class FilesMetadataComponent implements OnInit, AfterViewInit {
  filesMetaData: FileMetaData[];

  private downloadFileBaseUrl = 'http://localhost:3000/api/data-storage/download-file/';
  private selectedCheckboxes: Array<any>;
  private selectedFileIdToRename: string;

  constructor(
    private uploadFileService: UploadFileService,
    private getFilesMetaDataService: GetFilesMetadataService,
    private deleteFileService: DeleteFileService,
    private renameFileService: RenameFileService,
    private formBuilder: FormBuilder) {
      this.addFilesMetaData();
      this.selectedCheckboxes = new Array();
      this.uploadFileService.fileUploaded$
        .subscribe(() => {
          this.addFilesMetaData();
        });
      this.deleteFileService.fileDeleted$
        .subscribe(() => {
          this.addFilesMetaData();
        });
      this.deleteFileService.allFilesDeleted$
        .subscribe(() => {
          this.addFilesMetaData();
        });
      this.deleteFileService.selectedFilesDeleted$
        .subscribe(() => {
          this.addFilesMetaData();
        });
      this.renameFileService.fileRenamed$
        .subscribe(() => {
          this.addFilesMetaData();
        });
  }

  ngOnInit(): void { }

  ngAfterViewInit(){ }

  @ViewChild('newNameInput') newNameInput: ElementRef;

  addFilesMetaData() {
    this.getFilesMetaDataService.getFilesMetaData()
      .subscribe(
        res => {
          this.filesMetaData = res;
        },
        err => {
          console.log(err);
        }
      );
  }

  deleteFile(event: any) {
    /*const target = event.target || event.srcElement || event.currentTarget;*/
    const target = event.target;
    const idAttr = target.attributes.value;
    const value = idAttr.nodeValue;

    this.deleteFileService.deleteFile(value).subscribe();
  }

  deleteAll(event: any) {
    this.deleteFileService.deleteAll().subscribe();
  }

  collectSelectedFilesToDelete(event: any) {
    const target = event.target;
    const idAttr = target.attributes.value;
    const value = idAttr.nodeValue;

    if(target.checked) {
      this.selectedCheckboxes.push(value);
    } else if(!event.target.checked) {
      this.selectedCheckboxes.splice(value, 1);
    }
  }

  deleteSelected(event: any) {
    this.deleteFileService.deleteSelected(this.selectedCheckboxes).subscribe();
  }

  getRenamedFileId(event: any) {
    const target = event.target;
    const idAttr = target.attributes.value;
    const value = idAttr.nodeValue;

    this.selectedFileIdToRename = value;
  }

  renameFileOnSubmit(renameFileForm: NgForm) {
    this.renameFileService.renameFile(this.selectedFileIdToRename, renameFileForm.value).subscribe();
    this.newNameInput.nativeElement.value ='';
  }
}
