# friend-backup

A way of backing up your data using your friends' PCs.

Encrypted with [openpgp](https://www.npmjs.com/package/openpgp)

Encrypted files are split into 5mb chunks

No servers are involved in the transfer process, the only time a server is used is to update the electron app itself.

TODO:

- [ ] Implement a way of downloading and decrypting the data stored on remote machines.
- [ ] Be able to upload folders.
- [ ] Be able to upload a folder/file to multiple machines at the same time.
- [ ] Measure upload/download/ping speeds on remote machines.
- [ ] Set a limit to how many files can be on a machine in total to prevent a machine from being completely overloaded with files.
- [ ] Delete machines functionality.
- [ ] File viewing structure for remote machines
- [ ] Check machine status (online, offline etc)
- [ ] Check machine stats (ping, upload, download etc) and be able to re-check every 24 hours etc

## Usage
Tested and built on Node `V16`

To run locally, download all files, navigate into the directory and run

```
npm install/yarn install
```

To start, run `yarn start` or `npm start`

To build, run `yarn make` or `npm run make`. This will output in a directory called `out/`

Ports used:

- UI: 3000
- Websocket: 3001 (can be changed in settings, but requires reboot)

## Libraries/Tools used

1. [ElectronJS](https://www.electronjs.org)
2. [ReactJS](https://reactjs.org)
3. [TailwindCSS](https://tailwindcss.com)
4. [Font Awesome](https://fontawesome.com)
5. [Electron Store](https://github.com/sindresorhus/electron-store)
6. [openpgp](https://www.npmjs.com/package/openpgp)
7. [split-file](https://www.npmjs.com/package/split-file)
8. [ws](https://www.npmjs.com/package/ws)

Developed locally using node `v16`
