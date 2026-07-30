import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileMetadata } from './file-metadata.interface';

@Component({
  selector: 'input-file-metadata',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-file-metadata.component.html',
  styleUrls: ['./input-file-metadata.component.css']
})
export class InputFileMetadataComponent implements AfterViewInit, OnDestroy {
  @Input() metaTitleId?: string;
  @Input() metaDescId?: string;
  @Input() metaModal: boolean | string = true;
  @Input() name: string = 'file';

  @Output() fileMetadataChange = new EventEmitter<FileMetadata>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('modalFileInput') modalFileInput?: ElementRef<HTMLInputElement>;

  showModal = false;
  
  modalTitle = '';
  modalDesc = '';
  
  titleError = false;
  descError = false;
  fileError = false;
  
  displayName = '🔗 Cargar archivo';
  isBold = false;
  
  private externalTitleEl?: HTMLInputElement | null;
  private externalDescEl?: HTMLInputElement | null;
  
  private titleListener = () => this.syncMetadata();
  private descListener = () => this.syncMetadata();

  currentFile?: File;
  metadata?: FileMetadata;

  get useModal(): boolean {
    return !(this.metaModal === 'false' || this.metaModal === false || (this.metaTitleId && this.metaDescId));
  }

  ngAfterViewInit() {
    if (!this.useModal) {
      if (this.metaTitleId) {
        this.externalTitleEl = document.getElementById(this.metaTitleId) as HTMLInputElement;
        if (!this.externalTitleEl) {
          this.externalTitleEl = document.querySelector(`[name="${this.metaTitleId}"]`) as HTMLInputElement;
        }
        if (this.externalTitleEl) {
          this.externalTitleEl.addEventListener('input', this.titleListener);
        }
      }
      if (this.metaDescId) {
        this.externalDescEl = document.getElementById(this.metaDescId) as HTMLInputElement;
        if (!this.externalDescEl) {
          this.externalDescEl = document.querySelector(`[name="${this.metaDescId}"]`) as HTMLInputElement;
        }
        if (this.externalDescEl) {
          this.externalDescEl.addEventListener('input', this.descListener);
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.externalTitleEl) {
      this.externalTitleEl.removeEventListener('input', this.titleListener);
    }
    if (this.externalDescEl) {
      this.externalDescEl.removeEventListener('input', this.descListener);
    }
  }

  onWrapperClick() {
    if (this.useModal) {
      this.modalTitle = this.metadata?.titulo || '';
      this.modalDesc = this.metadata?.descripcion || '';
      this.resetErrors();
      this.showModal = true;
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.currentFile = file;
      if (!this.useModal) {
        // En modo sin modal, se sincronizan los metadatos de inmediato
        this.syncMetadata();
      }
    } else if (!this.useModal) {
      this.currentFile = undefined;
      this.metadata = undefined;
      this.updateDisplay();
    }
  }

  syncMetadata() {
    if (!this.currentFile) return;
    
    const title = this.externalTitleEl ? this.externalTitleEl.value : '';
    const desc = this.externalDescEl ? this.externalDescEl.value : '';
    
    this.updateMetadataObject(this.currentFile, title, desc);
    this.updateDisplay(this.currentFile.name);
  }

  updateMetadataObject(file: File, title: string, desc: string) {
    const originalName = file.name;
    const extension = originalName.includes('.') ? originalName.split('.').pop() || '' : '';
    
    // Mantener la fecha original si ya existía el objeto
    const date = this.metadata?.fecha || new Date().toISOString();
    
    this.metadata = {
      file,
      titulo: title,
      descripcion: desc,
      fecha: date,
      nombreOriginal: originalName,
      extension,
      size: file.size
    };
    
    this.fileMetadataChange.emit(this.metadata);
  }

  updateDisplay(name?: string) {
    if (name) {
      this.displayName = '📄 ' + name;
      this.isBold = true;
    } else {
      this.displayName = '🔗 Cargar archivo';
      this.isBold = false;
    }
  }

  closeModal() {
    this.showModal = false;
  }

  acceptModal() {
    this.resetErrors();
    let isValid = true;
    
    const title = this.modalTitle.trim();
    const desc = this.modalDesc.trim();
    
    if (!title) {
      this.titleError = true;
      isValid = false;
    }
    if (!desc) {
      this.descError = true;
      isValid = false;
    }
    
    const file = this.modalFileInput?.nativeElement.files?.[0];
    const hasExistingFile = !!this.currentFile;
    
    if (!file && !hasExistingFile) {
      this.fileError = true;
      isValid = false;
    }
    
    if (!isValid) return;
    
    // Si validó exitosamente
    if (file) {
      this.currentFile = file;
      // Transferir archivo al input principal (opcional si usamos ngModel, pero útil para Formularios nativos)
      const dt = new DataTransfer();
      dt.items.add(file);
      this.fileInput.nativeElement.files = dt.files;
      
      this.updateMetadataObject(file, title, desc);
      this.updateDisplay(file.name);
    } else if (this.currentFile && this.metadata) {
      // Solo actualizamos textos
      this.metadata.titulo = title;
      this.metadata.descripcion = desc;
      this.fileMetadataChange.emit(this.metadata);
    }
    
    this.closeModal();
  }

  resetErrors() {
    this.titleError = false;
    this.descError = false;
    this.fileError = false;
  }
}