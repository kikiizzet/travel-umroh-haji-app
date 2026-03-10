import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PaketModule } from './paket/paket.module';
import { PembayaranModule } from './pembayaran/pembayaran.module';
import { JamaahModule } from './jamaah/jamaah.module';
import { TestimoniModule } from './testimoni/testimoni.module';
import { GaleriModule } from './galeri/galeri.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UploadController } from './common/upload.controller';

@Module({
  imports: [
    AuthModule,
    PaketModule,
    PembayaranModule,
    JamaahModule,
    TestimoniModule,
    GaleriModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      renderPath: '/uploads/(.*)', // Hanya tangani file di dalam folder uploads
    }),
  ],
  controllers: [AppController, UploadController],
  providers: [AppService],
})
export class AppModule { }
