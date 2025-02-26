import fs from 'fs';
import path from 'path';
import CustomError from '../../errors/CustomError.js';

class DiskManager{
    constructor(basePath, maxSize){
        this._basePath = basePath;
        this._maxSize = this._toBytes(maxSize);
    }

    _toBytes(sizeStr){
        let size;

        sizeStr = String(sizeStr).toLowerCase();
        const format = sizeStr.slice(sizeStr.length - 2, sizeStr.length);
        const formatGradation = ['kb', 'mb', 'gb', 'tb'];
        const index = formatGradation.indexOf(format);
        size = Number(sizeStr.match(/\d+/)[0]);
        
        if (typeof index === 'number'){
            for (let i = 0; i <= index; i++){
                size = size * 1024;
            }
        }


        return size;
    }

    async save(path, data){
        if (!this.canSave(data.size)) throw new CustomError('File size exceeds disk space limit', 413);

        fs.writeFile(this._basePath, data)
    }

    // async delete(path){

    // }

    // async update(path){

    // }
    _getAllFiles(arrayOfFiles = [], dir = this._basePath) {
        const files = fs.readdirSync(dir);
       
        for (const file of files){
            if (fs.statSync(dir + "/" + file).isDirectory()) {
                arrayOfFiles = this._getAllFiles(arrayOfFiles, dir + "/" + file);
            } else {
                arrayOfFiles.push(path.join(dir, file))
            }
        }
      
        return arrayOfFiles;
    }

    getSpaceSize() {
        const arrayOfFiles = this._getAllFiles()
      
        let totalSize = 0
      
        arrayOfFiles.forEach(function(filePath) {
          totalSize += fs.statSync(filePath).size
        })
      
        return totalSize;
    }

    canSave(size){
        const currentSize = this.getSpaceSize();
        return currentSize + size <= this._maxSize ? true : false;
    }
}

export default DiskManager;